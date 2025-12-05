import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { monthPlansApi } from '../api/monthPlans';
import { useParams, useNavigate } from 'react-router-dom';

const MonthPlanDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: plan, isLoading } = useQuery({
        queryKey: ['monthPlans', id],
        queryFn: () => monthPlansApi.getOne(id!),
        enabled: !!id,
    });

    const submitMutation = useMutation({
        mutationFn: monthPlansApi.submit,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['monthPlans', id] });
            alert('승인 요청되었습니다.');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: monthPlansApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['monthPlans'] });
            navigate('/month-plans');
        }
    });

    if (isLoading) return <div>Loading...</div>;
    if (!plan) return <div>Plan not found</div>;

    const isOwner = true; // TODO: Check ID
    const canModify = isOwner && (plan.status === 'DRAFT' || plan.status === 'REJECTED');

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-2 text-sm text-gray-500">
                &larr; <span onClick={() => navigate('/month-plans')} className="cursor-pointer hover:underline">목록으로 돌아가기</span>
            </div>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{plan.month}월: {plan.title}</h1>
                    <p className="text-gray-500">
                        연간 계획: {plan.yearPlan?.title} ({plan.yearPlan?.year}년)
                    </p>
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
                                onClick={() => {
                                    if (confirm('삭제하시겠습니까?')) deleteMutation.mutate(id!);
                                }}
                                className="text-sm text-red-500 hover:text-red-700 underline"
                            >
                                삭제
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-lg font-bold mb-3 border-b pb-2">계획 상세 내용</h2>
                <div className="whitespace-pre-wrap text-gray-700 min-h-[100px]">
                    {plan.description || '내용이 없습니다.'}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-lg font-bold mb-3 border-b pb-2">주요 과제 및 태스크</h2>
                <div className="text-center py-8 text-gray-400 bg-gray-50 rounded border border-dashed">
                    <p>등록된 태스크가 없습니다.</p>
                    <p className="text-xs mt-1">Sprint 3에서 태스크 관리 기능이 추가될 예정입니다.</p>
                </div>
            </div>

            {canModify && plan.status === 'DRAFT' && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => submitMutation.mutate(id!)}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 shadow-md transition"
                    >
                        승인 요청하기
                    </button>
                </div>
            )}
        </div>
    );
};

export default MonthPlanDetailPage;
