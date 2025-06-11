import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';

const SearchBar = ({ query, onQueryChange, placeholder = "What do you want to listen to?" }) => {
  return (
    <div className="relative max-w-md">
      <ApperIcon
        name="Search"
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
      />
      <Input
        type="text"
        value={query}
        onChange={onQueryChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 rounded-full"
      />
    </div>
  );
};

export default SearchBar;