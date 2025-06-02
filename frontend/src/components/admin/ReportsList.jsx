import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import reportService from '../../services/reportService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const ReportsList = () => {
  const { isAdmin } = useAuth();
  const { addNotification } = useNotification();
  
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await reportService.getReports();
        setReports(response.data.data);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReports();
  }, []);
  
  const handleUpdateStatus = async (id, status) => {
    try {
      await reportService.updateReportStatus(id, status);
      
      // Update local state
      setReports(reports.map(report => 
        report._id === id ? { ...report, status } : report
      ));
      
      addNotification(`Report marked as ${status}`, 'success');
    } catch (err) {
      console.error('Error updating report status:', err);
      addNotification('Failed to update report status', 'error');
    }
  };
  
  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <ErrorMessage message="You do not have permission to access this page." />
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (error) {
    return <ErrorMessage message={error} />;
  }
  
  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No reports found.</p>
        <a href="/admin" className="btn btn-primary mt-4">
          Back to Dashboard
        </a>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reports Management</h2>
        <a href="/admin" className="btn btn-outline">
          Back to Dashboard
        </a>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {report.reporterId ? `${report.reporterId.firstName} ${report.reporterId.lastName}` : 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {report.targetType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {report.targetType === 'item' && report.itemId ? (
                      <a 
                        href={`/items/${report.itemId._id}`}
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {report.itemId.title}
                      </a>
                    ) : report.targetType === 'user' && report.userId ? (
                      <span>{report.userId.firstName} {report.userId.lastName}</span>
                    ) : (
                      'Unknown'
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="truncate max-w-xs">
                      {report.reason}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      report.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : report.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      {report.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(report._id, 'resolved')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Resolve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(report._id, 'dismissed')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Dismiss
                          </button>
                        </>
                      )}
                      {report.status !== 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(report._id, 'pending')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Reopen
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsList;
