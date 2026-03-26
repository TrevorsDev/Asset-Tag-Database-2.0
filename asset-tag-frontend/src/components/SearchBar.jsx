import { Search } from 'lucide-react';
import './AssetToolbar.css';

const SearchBar = ({ value, onChange }) => {
    return (
        <div className="search-wrapper">
            <Search className="search-icon" />
            <input
                type="text"
                className="search-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search assets..."
            />
        </div>
    );
};

export default SearchBar;
