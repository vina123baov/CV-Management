import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Calendar, 
  Star, 
  Mail, 
  Settings,
  Bell,
  Search,
  Plus,
  MoreHorizontal,
  TrendingUp,
  UserCheck,
  Clock,
  Target
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Types
interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface Stat {
  label: string;
  value: string;
  change: string;
  color: string;
}

interface Application {
  name: string;
  position: string;
  time: string;
  status: 'pending' | 'approved' | 'interview' | 'rejected';
}

interface Interview {
  candidate: string;
  position: string;
  time: string;
  interviewer: string;
}

const AdminDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard },
    { id: 'jobs', label: 'Mô tả công việc', icon: FileText },
    { id: 'candidates', label: 'Ứng viên', icon: Users },
    { id: 'interviews', label: 'Lịch phỏng vấn', icon: Calendar },
    { id: 'evaluations', label: 'Đánh giá phỏng vấn', icon: Star },
    { id: 'email', label: 'Quản lý email', icon: Mail },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  const stats: Stat[] = [
    { label: 'Tổng ứng viên', value: '1,247', change: '+12%', color: 'bg-blue-500' },
    { label: 'Vị trí tuyển dụng', value: '38', change: '+3%', color: 'bg-green-500' },
    { label: 'Phỏng vấn hôm nay', value: '12', change: '+8%', color: 'bg-purple-500' },
    { label: 'Tỷ lệ chấp nhận', value: '73%', change: '+5%', color: 'bg-orange-500' },
  ];

  const recentApplications: Application[] = [
    { name: 'Nguyễn Văn A', position: 'Frontend Developer', time: '2 giờ trước', status: 'pending' },
    { name: 'Trần Thị B', position: 'Backend Developer', time: '4 giờ trước', status: 'approved' },
    { name: 'Lê Văn C', position: 'UI/UX Designer', time: '6 giờ trước', status: 'interview' },
    { name: 'Phạm Thị D', position: 'Product Manager', time: '8 giờ trước', status: 'rejected' },
    { name: 'Hoàng Văn E', position: 'DevOps Engineer', time: '1 ngày trước', status: 'pending' },
  ];

  const upcomingInterviews: Interview[] = [
    { candidate: 'Nguyễn Minh F', position: 'Senior Developer', time: '10:00 AM', interviewer: 'Mr. Phong' },
    { candidate: 'Trần Thị G', position: 'Marketing Manager', time: '2:00 PM', interviewer: 'Ms. Lan' },
    { candidate: 'Lê Văn H', position: 'Data Analyst', time: '4:00 PM', interviewer: 'Mr. Tuan' },
  ];

  const getStatusColor = (status: Application['status']): string => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'interview': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Application['status']): string => {
    switch (status) {
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      case 'interview': return 'Phỏng vấn';
      case 'pending': return 'Chờ duyệt';
      default: return 'Không xác định';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-bold text-gray-900">Recruit AI</h1>
                <p className="text-xs text-gray-500">Hệ thống quản lý tuyển dụng</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeMenu === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">AI</span>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">admintest</p>
                <p className="text-xs text-gray-500 truncate">adminhieu@gmail.com</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <LayoutDashboard className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900">Bảng điều khiển</h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Thêm mới</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    {index === 0 && <Users className="w-6 h-6 text-white" />}
                    {index === 1 && <FileText className="w-6 h-6 text-white" />}
                    {index === 2 && <Calendar className="w-6 h-6 text-white" />}
                    {index === 3 && <UserCheck className="w-6 h-6 text-white" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Applications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Đơn ứng tuyển gần đây</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Xem tất cả
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentApplications.map((app, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {app.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{app.name}</p>
                          <p className="text-sm text-gray-500">{app.position}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                          {getStatusText(app.status)}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{app.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Interviews */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Lịch phỏng vấn sắp tới</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Xem lịch
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingInterviews.map((interview, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{interview.candidate}</p>
                          <p className="text-sm text-gray-500">{interview.position}</p>
                          <p className="text-xs text-gray-400">Phỏng vấn với {interview.interviewer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{interview.time}</p>
                        <button className="text-blue-600 hover:text-blue-700 text-sm">
                          Tham gia
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Tạo công việc mới</p>
                  <p className="text-sm text-gray-500">Đăng tin tuyển dụng</p>
                </div>
              </button>
              
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Quản lý ứng viên</p>
                  <p className="text-sm text-gray-500">Xem và đánh giá CV</p>
                </div>
              </button>
              
              <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Lên lịch phỏng vấn</p>
                  <p className="text-sm text-gray-500">Tạo cuộc hẹn mới</p>
                </div>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;