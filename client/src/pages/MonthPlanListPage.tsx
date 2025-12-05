import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { monthPlansApi } from '../api/monthPlans';
import { yearPlansApi } from '../api/yearPlans';
import { useNavigate } from 'react-router-dom';

const MonthPlanListPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedYearPlanId, setSelectedYearPlanId] = useState<string>('');

    const { data: yearPlans } = useQuery({
        queryKey: ['yearPlans'],
        queryFn: () => yearPlansApi.getAll(),
    });

    const { data: monthPlans, isLoading } = useQuery({
        queryKey: ['monthPlans', selectedYearPlanId],
        queryFn: () => monthPlansApi.getAll(selectedYearPlanId ? { yearPlanId: selectedYearPlanId } : undefined),
        enabled: true
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">월간 계획 자원 관리</h1>
                <button
                    onClick={() => navigate('/month-plans/new')}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    월간 계획 수립
                </button>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">연간 계획 필터</label>
                <select
                    value={selectedYearPlanId}
                    onChange={(e) => setSelectedYearPlanId(e.target.value)}
                    className="border rounded px-3 py-2 w-full max-w-xs"
                >
                    <option value="">전체 보기</option>
                    {yearPlans?.map((yp: any) => (
                        <option key={yp.id} value={yp.id}>{yp.year}년 - {yp.title}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {monthPlans?.map((plan: any) => (
                    <div
                        key={plan.id}
                        onClick={() => navigate(`/month-plans/${plan.id}`)}
                        className="border rounded-lg p-4 shadow hover:shadow-lg cursor-pointer bg-white transition relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-2">
                            <span className={`text-xs px-2 py-1 rounded ${plan.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                    plan.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                        plan.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                }`}>
                                {plan.status}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-blue-600 mb-1">{plan.month}월</h3>
                        <p className="font-medium mb-2 truncate">{plan.title}</p>
                        <p className="text-sm text-gray-500 mb-2">
                            {plan.yearPlan?.title}
                        </p>
                        <div className="text-xs text-gray-400 mt-2">
                            작성자: {plan.user.name}
                        </div>
                    </div>
                ))}

                {monthPlans?.length === 0 && (
                    <div className="col-span-full text-center py-10 text-gray-500 bg-gray-50 rounded">
                        등록된 월간 계획이 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
};

export default MonthPlanListPage;
