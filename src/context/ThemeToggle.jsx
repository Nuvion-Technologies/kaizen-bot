// import React, { useContext } from 'react';
// import { ThemeContext } from './ThemeContext';
// import { Sun, Moon } from 'lucide-react';
//
// const ThemeToggle = () => {
//     const { theme, toggleTheme } = useContext(ThemeContext);
//
//     return (
//         <button
//             onClick={toggleTheme}
//             className="text-white"
//             title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'} // Added tooltip
//         >
//             {theme === 'light' ? <Moon size={20} className={'text-white'} /> : <Sun size={20} className={'text-white'} />}
//         </button>
//     );
// };
//
// export default ThemeToggle;


//
// import React, { useContext } from 'react';
// import { ThemeContext } from './ThemeContext';
// import { Sun, Moon } from 'lucide-react';
//
// const ThemeToggle = () => {
//     const toggleTheme = () => {
//         if (localStorage.getItem('theme') === 'dark') {
//             localStorage.setItem('theme', 'light');
//         }
//         else localStorage.setItem('theme', 'dark');
//     }
//
//
//     const theme = localStorage.getItem('theme');
//
//     return (
//         <button
//             onClick={toggleTheme}
//             className=''
//             title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'} // Added tooltip
//         >
//             {theme === 'light' ? <Moon size={20} className={'text-white'} /> : <Sun size={20} className={'text-white'} />}
//         </button>
//     );
// };
//
// export default ThemeToggle;





import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext'; // Adjusted path
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
            {theme === 'light' ? (
                <Moon size={20} className="text-gray-500 dark:text-gray-300" />
            ) : (
                <Sun size={20} className="text-gray-500 dark:text-gray-300" />
            )}
        </button>
    );
};

export default ThemeToggle;

