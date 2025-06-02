import React from 'react';
import { useNotification } from '../../hooks/useNotification';
import reportService from '../../services/reportService';
import LoadingSpinner from '../common/LoadingSpinner';

const ReportDownloads = () => {
  const { addNotification } = useNotification();
  const [loading, setLoading] = React.useState({
    inventory: false,
    category: false
  });

  const handleDownloadInventory = async () => {
    try {
      setLoading({ ...loading, inventory: true });
      const response = await reportService.downloadItemsInventoryReport();
      
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `items-inventory-${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      addNotification('Inventory report downloaded successfully', 'success');
    } catch (err) {
      console.error('Error downloading inventory report:', err);
      addNotification('Failed to download inventory report', 'error');
    } finally {
      setLoading({ ...loading, inventory: false });
    }
  };

  const handleDownloadCategory = async () => {
    try {
      setLoading({ ...loading, category: true });
      const response = await reportService.downloadItemsByCategoryReport();
      
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `items-by-category-${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      addNotification('Category report downloaded successfully', 'success');
    } catch (err) {
      console.error('Error downloading category report:', err);
      addNotification('Failed to download category report', 'error');
    } finally {
      setLoading({ ...loading, category: false });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Download Reports</h3>
      <p className="text-gray-600 mb-4">
        Export inventory data to Excel for offline analysis and record-keeping.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-2">Inventory Report</h4>
          <p className="text-sm text-gray-500 mb-4">
            Download a complete list of all available and sold items with details.
          </p>
          <button
            onClick={handleDownloadInventory}
            className="btn btn-primary w-full"
            disabled={loading.inventory}
          >
            {loading.inventory ? (
              <LoadingSpinner size="small" text="Generating..." />
            ) : (
              'Download Inventory Report'
            )}
          </button>
        </div>
        
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-2">Category Summary Report</h4>
          <p className="text-sm text-gray-500 mb-4">
            Download a summary of items by category with counts and values.
          </p>
          <button
            onClick={handleDownloadCategory}
            className="btn btn-primary w-full"
            disabled={loading.category}
          >
            {loading.category ? (
              <LoadingSpinner size="small" text="Generating..." />
            ) : (
              'Download Category Report'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDownloads;
