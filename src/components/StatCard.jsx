import React from 'react';

const StatCard = ({ title, value, icon, color = "bg-blue-100 text-blue-600", change, changeType = "neutral" }) => {
    const getChangeColor = () => {
        if (changeType === 'positive') return 'text-green-600';
        if (changeType === 'negative') return 'text-red-600';
        return 'text-gray-500';
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>

                    {change && (
                        <div className={`flex items-center mt-2 ${getChangeColor()}`}>
                            {changeType === 'positive' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                </svg>
                            )}
                            {changeType === 'negative' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12 13a1 1 0 110 2H7a1 1 0 01-1-1v-5a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0L16 9.586V7a1 1 0 112 0v5a1 1 0 01-1 1h-5z" clipRule="evenodd" />
                                </svg>
                            )}
                            <span className="text-sm font-medium">{change}</span>
                        </div>
                    )}
                </div>

                <div className={`rounded-full p-3 ${color}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatCard;
