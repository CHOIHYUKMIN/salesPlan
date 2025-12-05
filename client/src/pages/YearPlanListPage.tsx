import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { yearPlansApi } from '../api/yearPlans';
import { useNavigate } from 'react-router-dom';

const YearPlanListPage: React.FC = () => {
    const navigate = useNavigate();
    const { data: yearPlans, isLoading } = useQuery({
        queryKey: ['yearPlans'],
        queryFn: () => yearPlansApi.getAll(),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">연간 계획 목록</h1>
                <button
                    onClick={() => navigate('/year-plans/new')}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    계획 수립하기
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {yearPlans?.map((plan: any) => (
                    <div
                        key={plan.id}
                        onClick={() => navigate(`/year-plans/${plan.id}`)}
                        className="border rounded-lg p-4 shadow hover:shadow-lg cursor-pointer bg-white transition"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold">{plan.year}년 계획</h3>
                            <span className={`px-2 py-1 text-xs rounded ${plan.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                    plan.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                        plan.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                }`}>
                                {plan.status}
                            </span>
                        </div>
                        <p className="font-bold mb-2">{plan.title}</p>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{plan.description}</p>
                        <div className="text-sm text-gray-500">
                            작성자: {plan.user.name}
                        </div>
                    </div>
                ))}

                {yearPlans?.length === 0 && (
                    <div className="col-span-full text-center py-10 text-gray-500">
                        등록된 연간 계획이 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
};

export default YearPlanListPage;
