'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/auth.action';

export default function InterviewForm() {
  const [techstack, setTechstack] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtherRoleInput, setShowOtherRoleInput] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (!formRef.current) {
        throw new Error('Form not found');
      }

      const formData = new FormData(formRef.current);
      
      // Get role value - either from select or other input
      const role = selectedRole === 'other' 
        ? formData.get('other_role')
        : selectedRole;

      if (!role) {
        throw new Error('Role is required');
      }

      const interviewData = {
        type: formData.get('type'),
        role: role,
        level: formData.get('level'),
        techstack: techstack,
        amount: formData.get('amount'),
        userid: user.id
      };

      const response = await fetch('http://localhost:3001/api/vapi/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interviewData)
      });

      if (!response.ok) throw new Error('Failed to generate questions');
      
      const result = await response.json();
      router.push(`/interview/results?data=${encodeURIComponent(JSON.stringify(result))}`);
      
    } catch (error) {
      console.error('Error:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedRole(value);
    setShowOtherRoleInput(value === 'other');
  };


  return (
    <form ref={formRef}
    onSubmit={handleSubmit} 
    className="space-y-4 max-w-md mx-auto p-4">
      <div>
        <label className="block mb-2 text-sm font-medium">Interview Type</label>
        <select 
          name="type" 
          className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-black"
          required
          defaultValue="mixed"
        >
          <option value="technical">Technical</option>
          <option value="behavioral">Behavioral</option>
          <option value="mixed">Mixed</option>
          <option value="dsa">DSA Only</option>
        </select>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">Target Role</label>
        <select
          name="role"
          className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-black"
          required
          onChange={handleRoleChange}
          value={selectedRole}
        >
          <option value="">Select a role</option>
          <optgroup label="Tech/IT Roles">
            <option value="frontend_developer">Frontend Developer</option>
            <option value="backend_developer">Backend Developer</option>
            <option value="fullstack_developer">Full Stack Developer</option>
            <option value="mobile_app_developer">Mobile App Developer</option>
            <option value="ui_ux_designer">UI/UX Designer</option>
          </optgroup>
          
          <optgroup label="Banking/Finance">
            <option value="bank_cashier">Bank Cashier</option>
            <option value="relationship_manager">Relationship Manager</option>
            <option value="loan_officer">Loan Officer</option>
          </optgroup>
          
          <optgroup label="Sales/Customer Service">
            <option value="sales_executive">Sales Executive</option>
            <option value="customer_support">Customer Support</option>
            <option value="telecaller">Telecaller</option>
          </optgroup>
          
          <optgroup label="Operations/Logistics">
            <option value="operations_executive">Operations Executive</option>
            <option value="delivery_agent">Delivery Agent</option>
          </optgroup>
          
          <option value="other">Other (Please Specify)</option>
        </select>

        {showOtherRoleInput && (
          <div className="mt-2">
            <input
              type="text"
              name="other_role"
              className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="Please specify your target role"
              required={showOtherRoleInput}
            />
          </div>
        )}
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">Experience Level</label>
        <select 
          name="level" 
          className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-black"
          required
        >
          <option value="fresher">Fresher</option>
          <option value="junior">Junior (1-2 yrs)</option>
          <option value="mid">Mid-level (3-5 yrs)</option>
          <option value="senior">Senior (5+ yrs)</option>
        </select>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">
          Tech Stack/Skills (comma separated)
        </label>
        <input 
          type="text" 
          value={techstack}
          onChange={(e) => setTechstack(e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-black"
          placeholder="e.g. next.js, python or cash_handling, customer_service"
          required
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">Number of Questions</label>
        <input 
          type="number" 
          name="amount" 
          min="1" 
          max="20" 
          defaultValue="5"
          className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-black"
          required
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50"
      >
        {isSubmitting ? 'Generating...' : 'Generate Questions'}
      </button>
    </form>
  );
}