import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-dark">ERP Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-700 hover:text-primary transition"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* KPI Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">연간 목표 달성률</h3>
            </div>
            <p className="text-3xl font-bold text-primary">75%</p>
            <p className="text-sm text-success mt-2">▲ 5% 전월 대비</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">월간 계획 진행률</h3>
            </div>
            <p className="text-3xl font-bold text-info">82%</p>
            <p className="text-sm text-success mt-2">▲ 12% 전월 대비</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">완료된 태스크</h3>
            </div>
            <p className="text-3xl font-bold text-success">24</p>
            <p className="text-sm text-gray-500 mt-2">총 32개 중</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">업체 미팅</h3>
            </div>
            <p className="text-3xl font-bold text-warning">8</p>
            <p className="text-sm text-gray-500 mt-2">이번 주</p>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">최근 활동</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-500 text-center py-8">
              데이터를 불러오는 중입니다...
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
