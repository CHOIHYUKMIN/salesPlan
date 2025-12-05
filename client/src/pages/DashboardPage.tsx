import React from 'react';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* KPI Cards */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">연간 목표 달성률</h3>
        </div>
        <p className="text-3xl font-bold text-blue-600">75%</p>
        <p className="text-sm text-green-500 mt-2">▲ 5% 전월 대비</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">월간 계획 진행률</h3>
        </div>
        <p className="text-3xl font-bold text-indigo-500">82%</p>
        <p className="text-sm text-green-500 mt-2">▲ 12% 전월 대비</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">완료된 태스크</h3>
        </div>
        <p className="text-3xl font-bold text-green-600">24</p>
        <p className="text-sm text-gray-500 mt-2">총 32개 중</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">업체 미팅</h3>
        </div>
        <p className="text-3xl font-bold text-yellow-500">8</p>
        <p className="text-sm text-gray-500 mt-2">이번 주</p>
      </div>

      {/* Recent Activities */}
      <div className="col-span-full bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">최근 활동</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500 text-center py-8">
            데이터를 불러오는 중입니다...
          </p>
        </div>
      </div>
    </div>
  )
}
