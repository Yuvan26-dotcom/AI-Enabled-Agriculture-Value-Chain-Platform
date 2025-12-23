import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Mic } from 'lucide-react';

const ContractForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    counterparty: '',
    crop: 'soybean',
    quantity: '',
    price: '',
    maturityDate: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // In a real app, you'd include the auth token in headers
      const token = localStorage.getItem('token'); 
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };

      const res = await axios.post('http://localhost:5000/api/contracts', formData, config);
      setStatus(`Contract Created! Hash: ${res.data.contractHash}`);
    } catch (err) {
      console.error(err);
      setStatus('Error creating contract. Please login first.');
    }
  };

  const speakLabel = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser doesn't support text to speech.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
          Counterparty Name
          <button type="button" onClick={() => speakLabel("Counterparty Name")} className="text-gray-500 hover:text-blue-500">
            <Mic size={16} />
          </button>
        </label>
        <input
          type="text"
          name="counterparty"
          value={formData.counterparty}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
          {t('crop')}
          <button type="button" onClick={() => speakLabel(t('crop'))} className="text-gray-500 hover:text-blue-500">
            <Mic size={16} />
          </button>
        </label>
        <select
          name="crop"
          value={formData.crop}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="soybean">Soybean</option>
          <option value="groundnut">Groundnut</option>
          <option value="mustard">Mustard</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            Quantity (Quintals)
            <button type="button" onClick={() => speakLabel("Quantity in Quintals")} className="text-gray-500 hover:text-blue-500">
              <Mic size={16} />
            </button>
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            Agreed Price (₹)
            <button type="button" onClick={() => speakLabel("Agreed Price in Rupees")} className="text-gray-500 hover:text-blue-500">
              <Mic size={16} />
            </button>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
          Maturity Date
          <button type="button" onClick={() => speakLabel("Maturity Date")} className="text-gray-500 hover:text-blue-500">
            <Mic size={16} />
          </button>
        </label>
        <input
          type="date"
          name="maturityDate"
          value={formData.maturityDate}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        {t('create_contract')}
      </button>

      {status && (
        <div className={`mt-4 p-2 rounded ${status.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {status}
        </div>
      )}
    </form>
  );
};

export default ContractForm;