import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Users, 
  Search, 
  Edit, 
  Trash2, 
  Lock, 
  Unlock,
  Eye,
  EyeOff,
  Download,
  RefreshCw,
  X,
  Save,
  UserPlus,
  Shield,
  BookOpen,
  Building,
  GraduationCap,
  UserCog
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { userAPI } from '../api';

type UserRole = 'student' | 'lecturer' | 'department' | 'academic_affairs' | 'admin';

interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  department?: string;
  status: 'active' | 'inactive';
  createdDate: string;
  lastLogin?: string;
}

interface RolePermissions {
  role: UserRole;
  name: string;
  icon: any;
  color: string;
  permissions: string[];
}

const rolePermissionsData: RolePermissions[] = [
  {
    role: 'student',
    name: 'Sinh viên',
    icon: GraduationCap,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    permissions: [
      'Đăng nhập hệ thống',
      'Xem danh sách môn học cần đánh giá',
      'Thực hiện khảo sát đánh giá môn học',
      'Gửi phản hồi về giảng viên và môn học',
      'Xem trạng thái khảo sát',
      'Cập nhật thông tin cá nhân'
    ]
  },
  {
    role: 'lecturer',
    name: 'Giảng viên',
    icon: BookOpen,
    color: 'bg-green-100 text-green-700 border-green-200',
    permissions: [
      'Đăng nhập hệ thống',
      'Xem kết quả đánh giá của môn học',
      'Xem thống kê phản hồi sinh viên',
      'Xem nhận xét chi tiết của sinh viên',
      'Xem báo cáo đánh giá theo học kỳ'
    ]
  },
  {
    role: 'department',
    name: 'Khoa',
    icon: Building,
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    permissions: [
      'Đăng nhập hệ thống',
      'Xem báo cáo phản hồi theo môn học',
      'Xem báo cáo phản hồi theo giảng viên',
      'Xem thống kê đánh giá của khoa',
      'Xuất báo cáo phản hồi',
      'Theo dõi xu hướng đánh giá qua các học kỳ'
    ]
  },
  {
    role: 'academic_affairs',
    name: 'Phòng đào tạo',
    icon: UserCog,
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    permissions: [
      'Đăng nhập hệ thống',
      'Quản lý khảo sát phản hồi',
      'Tạo khảo sát đánh giá môn học',
      'Quản lý danh sách môn học khảo sát',
      'Xem báo cáo tổng hợp toàn trường',
      'Phân tích dữ liệu đánh giá theo khoa',
      'Xuất báo cáo tổng hợp'
    ]
  },
  {
    role: 'admin',
    name: 'Quản trị viên',
    icon: Shield,
    color: 'bg-red-100 text-red-700 border-red-200',
    permissions: [
      'Đăng nhập hệ thống quản trị',
      'Quản lý tài khoản người dùng',
      'Quản lý phân quyền hệ thống',
      'Quản lý danh sách sinh viên',
      'Quản lý danh sách giảng viên',
      'Quản lý danh sách môn học',
      'Quản lý học kỳ',
      'Cấu hình hệ thống khảo sát',
      'Giám sát hoạt động hệ thống'
    ]
  }
];

const getRoleInfo = (role: UserRole) => {
  return rolePermissionsData.find(r => r.role === role) || rolePermissionsData[0];
};

export default function UserManagementPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | UserRole>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRolePermissions, setSelectedRolePermissions] = useState<RolePermissions | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    role: 'student' as UserRole,
    department: '',
    password: ''
  });

  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    if (userRole === 'admin') {
      fetchUsers();
    }
  }, [userRole]);

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-100">
            <Lock className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Truy cập bị từ chối</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Bạn không có quyền truy cập trang này. Chỉ có <strong className="text-gray-800 font-semibold">Quản trị viên (Admin)</strong> mới được phép vào khu vực Quản lý người dùng.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all focus:ring-4 focus:ring-blue-500/20 active:scale-[0.98]"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userAPI.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      alert('Không thể tải danh sách người dùng!');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    byRole: {
      student: users.filter(u => u.role === 'student').length,
      lecturer: users.filter(u => u.role === 'lecturer').length,
      department: users.filter(u => u.role === 'department').length,
      academic_affairs: users.filter(u => u.role === 'academic_affairs').length,
      admin: users.filter(u => u.role === 'admin').length
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setFormData({
      username: '',
      fullName: '',
      email: '',
      role: 'student',
      department: '',
      password: ''
    });
    setShowPassword(false);
    setShowAddEditModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      department: user.department || '',
      password: ''
    });
    setShowPassword(false);
    setShowAddEditModal(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (confirm(`Bạn có chắc chắn muốn xóa tài khoản "${user.fullName}"?`)) {
      try {
        await userAPI.delete(user.id);
        setUsers(users.filter(u => u.id !== user.id));
        alert('Đã xóa tài khoản thành công!');
      } catch (error) {
        console.error(error);
        alert('Có lỗi xảy ra khi xóa!');
      }
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      await userAPI.update(user.id, { ...user, status: newStatus });
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, status: newStatus } : u
      ));
      alert(`Đã ${newStatus === 'active' ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản!`);
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái!');
    }
  };

  const handleResetPassword = (user: User) => {
    if (confirm(`Bạn có chắc chắn muốn reset mật khẩu cho "${user.fullName}"?`)) {
      alert('Mật khẩu mới đã được gửi qua email!');
    }
  };

  const handleViewPermissions = (role: UserRole) => {
    const roleInfo = getRoleInfo(role);
    setSelectedRolePermissions(roleInfo);
    setShowPermissionsModal(true);
  };

  const handleSaveUser = async () => {
    if (!formData.username || !formData.fullName || !formData.email) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    try {
      if (selectedUser) {
        // Edit existing user
        const updatedUser = await userAPI.update(selectedUser.id, formData);
        setUsers(users.map(u => u.id === selectedUser.id ? updatedUser : u));
        alert('Cập nhật tài khoản thành công!');
      } else {
        // Add new user
        if (!formData.password) {
          alert('Vui lòng nhập mật khẩu cho tài khoản mới!');
          return;
        }
        const newUser = await userAPI.create(formData);
        setUsers([...users, newUser]);
        alert('Thêm tài khoản mới thành công!');
      }
      setShowAddEditModal(false);
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra, vui lòng kiểm tra lại!');
    }
  };

  const handleExportUsers = () => {
    alert('Đang xuất danh sách người dùng...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-black flex items-center gap-3">
                <Users className="w-8 h-8" />
                Quản lý tài khoản người dùng
              </h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddUser}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <UserPlus className="w-5 h-5" />
              <span className="hidden sm:inline">Thêm người dùng</span>
            </button>
            <button
              onClick={handleExportUsers}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Xuất DS</span>
            </button>
            <button
              onClick={fetchUsers}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-lg transition-colors shadow-sm"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
            <p className="text-gray-600 text-xs mb-1">Tổng số</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
            <p className="text-gray-600 text-xs mb-1">Hoạt động</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
            <p className="text-gray-600 text-xs mb-1">Sinh viên</p>
            <p className="text-2xl font-bold text-blue-600">{stats.byRole.student}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
            <p className="text-gray-600 text-xs mb-1">Giảng viên</p>
            <p className="text-2xl font-bold text-green-600">{stats.byRole.lecturer}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
            <p className="text-gray-600 text-xs mb-1">Khoa</p>
            <p className="text-2xl font-bold text-purple-600">{stats.byRole.department}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-amber-500">
            <p className="text-gray-600 text-xs mb-1">Phòng ĐT</p>
            <p className="text-2xl font-bold text-amber-600">{stats.byRole.academic_affairs}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
            <p className="text-gray-600 text-xs mb-1">Admin</p>
            <p className="text-2xl font-bold text-red-600">{stats.byRole.admin}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, username, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoComplete="off"
                  name="search-users"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
               // @ts-ignore
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="student">Sinh viên</option>
                <option value="lecturer">Giảng viên</option>
                <option value="department">Khoa</option>
                <option value="academic_affairs">Phòng đào tạo</option>
                <option value="admin">Admin</option>
              </select>

              <select
                // @ts-ignore
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Vô hiệu hóa</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Đang tải dữ liệu...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
            <p className="text-yellow-800 text-lg">
              Không tìm thấy người dùng phù hợp
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Người dùng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Vai trò
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Đơn vị
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Đăng nhập cuối
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => {
                    const roleInfo = getRoleInfo(user.role);
                    const RoleIcon = roleInfo.icon;
                    
                    return (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{user.fullName}</p>
                            <p className="text-sm text-gray-500">{user.username}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${roleInfo.color} font-medium`}>
                              <RoleIcon className="w-4 h-4" />
                              {roleInfo.name}
                            </span>
                            <button
                              onClick={() => handleViewPermissions(user.role)}
                              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Xem quyền hạn"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-700">{user.department || '-'}</span>
                        </td>
                        <td className="px-6 py-4">
                          {user.status === 'active' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              Hoạt động
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                              Vô hiệu hóa
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {user.lastLogin || 'Chưa đăng nhập'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(user)}
                              className={`p-2 rounded-lg transition-colors ${
                                user.status === 'active'
                                  ? 'text-amber-600 hover:bg-amber-50'
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                              title={user.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                            >
                              {user.status === 'active' ? (
                                <Lock className="w-5 h-5" />
                              ) : (
                                <Unlock className="w-5 h-5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleResetPassword(user)}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Reset mật khẩu"
                            >
                              <Shield className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit User Modal */}
        {showAddEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  {selectedUser ? <Edit className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
                  {selectedUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
                </h2>
                <button
                  onClick={() => setShowAddEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên đăng nhập <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập tên đăng nhập"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập địa chỉ email"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vai trò <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="student">Sinh viên</option>
                      <option value="lecturer">Giảng viên</option>
                      <option value="department">Khoa</option>
                      <option value="academic_affairs">Phòng đào tạo</option>
                      <option value="admin">Quản trị viên</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Đơn vị
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="VD: Khoa CNTT"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu {selectedUser ? <span className="text-gray-400 font-normal ml-1">(Để trống nếu không đổi)</span> : <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={selectedUser ? "Nhập mật khẩu mới (tùy chọn)" : "Nhập mật khẩu"}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Permissions Preview */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900 mb-2">Quyền hạn của vai trò này:</p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {getRoleInfo(formData.role).permissions.slice(0, 5).map((perm, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        {perm}
                      </li>
                    ))}
                    {getRoleInfo(formData.role).permissions.length > 5 && (
                      <li className="text-blue-600 font-medium">
                        + {getRoleInfo(formData.role).permissions.length - 5} quyền khác...
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex gap-3 justify-end sticky bottom-0 bg-white">
                <button
                  onClick={() => setShowAddEditModal(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveUser}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {selectedUser ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Permissions Modal */}
        {showPermissionsModal && selectedRolePermissions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  {selectedRolePermissions.icon && <selectedRolePermissions.icon className="w-7 h-7" />}
                  Quyền hạn: {selectedRolePermissions.name}
                </h2>
                <button
                  onClick={() => setShowPermissionsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border mb-6 ${selectedRolePermissions.color}`}>
                  {selectedRolePermissions.icon && <selectedRolePermissions.icon className="w-5 h-5" />}
                  <span className="font-semibold">{selectedRolePermissions.name}</span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                  Các chức năng được phép thực hiện:
                </h3>
                <ul className="space-y-3">
                  {selectedRolePermissions.permissions.map((permission, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold text-sm">
                        {idx + 1}
                      </div>
                      <span className="text-gray-700 flex-1">{permission}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowPermissionsModal(false)}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
