import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { yearPlansApi, CreateYearPlanDto, CreateKpiDto } from '../api/yearPlans';
import { useNavigate } from 'react-router-dom';

const YearPlanFormPage: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState<CreateYearPlanDto>({
        year: new Date().getFullYear() + 1,
        title: '',
        description: '',
        kpis: [],
    });

    const [kpiInput, setKpiInput] = useState<CreateKpiDto>({ name: '', target: 0, unit: '' });

    const createPlanMutation = useMutation({
        mutationFn: yearPlansApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['yearPlans'] });
            navigate('/year-plans');
        },
        onError: (error) => {
            alert('Failed to create plan: ' + error);
        }
    });

    const handleAddKpi = () => {
        if (kpiInput.name && kpiInput.target > 0 && kpiInput.unit) {
            setFormData({
                ...formData,
                kpis: [...(formData.kpis || []), kpiInput],
            });
            setKpiInput({ name: '', target: 0, unit: '' });
        }
    };

    const removeKpi = (index: number) => {
        const newKpis = [...(formData.kpis || [])];
        newKpis.splice(index, 1);
        setFormData({ ...formData, kpis: newKpis });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createPlanMutation.mutate(formData);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">연간 계획 수립</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow space-y-4">
                    <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">연도</label>
                            <input
                                type="number"
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                className="w-full border rounded px-3 py-2"
                                min={2024}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full border rounded px-3 py-2 h-24"
                        />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">KPI 설정</h2>
                    </div>

                    <div className="flex gap-2 items-end mb-4 bg-gray-50 p-4 rounded">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">KPI 항목명</label>
                            <input
                                type="text"
                                placeholder="예: 매출액"
                                value={kpiInput.name}
                                onChange={(e) => setKpiInput({ ...kpiInput, name: e.target.value })}
                                className="w-full border rounded px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="w-32">
                            <label className="block text-xs font-medium text-gray-500 mb-1">목표값</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={kpiInput.target}
                                onChange={(e) => setKpiInput({ ...kpiInput, target: parseFloat(e.target.value) })}
                                className="w-full border rounded px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="w-24">
                            <label className="block text-xs font-medium text-gray-500 mb-1">단위</label>
                            <input
                                type="text"
                                placeholder="원"
                                value={kpiInput.unit}
                                onChange={(e) => setKpiInput({ ...kpiInput, unit: e.target.value })}
                                className="w-full border rounded px-3 py-2 text-sm"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleAddKpi}
                            className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
                        >
                            추가
                        </button>
                    </div>

                    {formData.kpis && formData.kpis.length > 0 ? (
                        <div className="space-y-2">
                            {formData.kpis.map((kpi, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 border rounded bg-gray-50">
                                    <div>
                                        <span className="font-medium">{kpi.name}</span>
                                        <span className="mx-2 text-gray-400">|</span>
                                        <span>{kpi.target.toLocaleString()} {kpi.unit}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeKpi(idx)}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                        삭제
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-4">등록된 KPI가 없습니다.</p>
                    )}
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/year-plans')}
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

export default YearPlanFormPage;
