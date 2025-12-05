import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { yearPlansApi } from '../api/yearPlans';
import { useParams, useNavigate } from 'react-router-dom';

const YearPlanDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: plan, isLoading } = useQuery({
        queryKey: ['yearPlans', id],
        queryFn: () => yearPlansApi.getOne(id!),
        enabled: !!id,
    });

    const submitMutation = useMutation({
        mutationFn: yearPlansApi.submit,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['yearPlans', id] });
            alert('승인 요청되었습니다.');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: yearPlansApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['yearPlans'] });
            navigate('/year-plans');
        }
    });

    if (isLoading) return <div>Loading...</div>;
    if (!plan) return <div>Plan not found</div>;

    const isOwner = true; // TODO: Check with current user ID
    const canModify = isOwner && (plan.status === 'DRAFT' || plan.status === 'REJECTED');

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{plan.title}</h1>
                    <p className="text-gray-500">{plan.year}년도 계획 • 작성자: {plan.user.name}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${plan.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            plan.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                plan.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                        }`}>
                        {plan.status}
                    </span>
                    {canModify && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate(`/year-plans/${id}/edit`)}
                                className="text-gray-600 hover:text-blue-600 text-sm"
                            >
                                수정
                            </button>
                            <button
                                onClick={() => {
                                    if (confirm('정말 삭제하시겠습니까?')) deleteMutation.mutate(id!);
                                }}
                                className="text-gray-600 hover:text-red-600 text-sm"
                            >
                                삭제
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-bold mb-4">계획 설명</h2>
                <div className="whitespace-pre-wrap text-gray-700 min-h-[100px]">
                    {plan.description || '설명이 없습니다.'}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-bold mb-4">KPI 목표</h2>
                {plan.kpis && plan.kpis.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {plan.kpis.map((kpi: any) => (
                            <div key={kpi.id} className="border p-4 rounded bg-gray-50">
                                <div className="text-gray-500 text-sm mb-1">KPI</div>
                                <div className="font-bold text-lg mb-2">{kpi.name}</div>
                                <div className="flex justify-between items-end">
                                    <span className="text-2xl font-bold text-blue-600">
                                        {kpi.target.toLocaleString()}
                                        <span className="text-sm text-gray-500 font-normal ml-1">{kpi.unit}</span>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">설정된 KPI가 없습니다.</p>
                )}
            </div>

            {canModify && plan.status === 'DRAFT' && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => submitMutation.mutate(id!)}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 shadow-md"
                    >
                        승인 요청하기
                    </button>
                </div>
            )}
        </div>
    );
};

export default YearPlanDetailPage;
