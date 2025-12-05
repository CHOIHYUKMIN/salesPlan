import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { monthPlansApi, CreateMonthPlanDto } from '../api/monthPlans';
import { yearPlansApi } from '../api/yearPlans';
import { useNavigate } from 'react-router-dom';

const MonthPlanFormPage: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: yearPlans } = useQuery({
        queryKey: ['yearPlans'],
        queryFn: () => yearPlansApi.getAll(), // Should ideally filter for active plans
    });

    const [formData, setFormData] = useState<CreateMonthPlanDto>({
        yearPlanId: '',
        month: new Date().getMonth() + 1,
        title: '',
        description: '',
    });

    const createPlanMutation = useMutation({
        mutationFn: monthPlansApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['monthPlans'] });
            navigate('/month-plans');
        },
        onError: (error) => {
            alert('Failed to create plan: ' + error);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.yearPlanId) {
            alert('연간 계획을 선택해주세요.');
            return;
        }
        createPlanMutation.mutate(formData);
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">월간 계획 수립</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">연간 계획 선택</label>
                    <select
                        value={formData.yearPlanId}
                        onChange={(e) => setFormData({ ...formData, yearPlanId: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                        required
                    >
                        <option value="">선택하세요</option>
                        {yearPlans?.map((yp: any) => (
                            <option key={yp.id} value={yp.id}>
                                {yp.year}년 - {yp.title}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                        본인의 연간 계획이 목록에 표시됩니다.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">월</label>
                        <select
                            value={formData.month}
                            onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                            className="w-full border rounded px-3 py-2"
                        >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                <option key={m} value={m}>{m}월</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full border rounded px-3 py-2"
                            placeholder="예: 1월 영업 집중 기간"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full border rounded px-3 py-2 h-32"
                        placeholder="이번 달 주요 목표와 전략을 기술하세요."
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                        type="button"
                        onClick={() => navigate('/month-plans')}
                        className="px-6 py-2 border rounded hover:bg-gray-50"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={createPlanMutation.isPending}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {createPlanMutation.isPending ? '저장 중...' : '계획 저장'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MonthPlanFormPage;
