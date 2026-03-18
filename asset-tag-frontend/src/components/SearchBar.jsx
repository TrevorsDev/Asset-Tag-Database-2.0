const SearchBar = ({ value, onChange }) => {
    return (
        <input
            type="text"
            className="search-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search assets..."
        />
    );
};

export default SearchBar;
