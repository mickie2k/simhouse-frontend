import React from 'react';

interface Step1Props {
    formData: any;
    setFormData: (data: any) => void;
    next: () => void;
    onClose: () => void;
}

export default function Step1GeneralInfo({ formData, setFormData, next, onClose }: Step1Props) {
    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <span className="text-sm font-semibold text-orange-600">Step 1 of 3</span>
                <span className="text-sm text-gray-400">Basic Configuration</span>
            </div>
            
            <h2 className="text-3xl font-bold mb-3">General Information</h2>
            <p className="text-gray-500 mb-10">Provide the basic details of your simulation hardware to get started.</p>

            <form className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold mb-2">Simulator Name</label>
                    <input 
                      type="text" 
                      // ผูกค่า value และสั่งอัปเดต formData เมื่อพิมพ์
                      value={formData.simulatorName || ''}
                      onChange={(e) => setFormData({ ...formData, simulatorName: e.target.value })}
                      placeholder="e.g., Moza R5 at Pattaya Hotel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
                    />
                </div>
                 <div>
                    <label className="block text-sm font-semibold mb-2">Simulator Descriptions</label>
                    <textarea 
                      // ผูกค่า value และสั่งอัปเดต formData เมื่อพิมพ์
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="e.g., This is the best sim racing in this area."
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
                    />
                </div>
                 <div>
                    <label className="block text-sm font-semibold mb-2">Installation Location</label>
                    <input 
                      type="text" 
                      // ผูกค่า value และสั่งอัปเดต formData เมื่อมีการพิมพ์ (เผื่ออนาคตเอาไปใช้)
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Berlin Facility - Room 302"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
                    />
                </div>
            </form>

            <div className="mt-12 pt-6 border-t border-gray-200 flex justify-end gap-4">
                <button 
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold text-gray-800 border border-gray-300 hover:bg-gray-50 transition"
                >
                    Save Draft
                </button>
                <button 
                  onClick={next}
                  className="px-10 py-2.5 rounded-lg text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 transition"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}