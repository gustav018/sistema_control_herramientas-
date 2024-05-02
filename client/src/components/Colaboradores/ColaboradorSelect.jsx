
import SelectSearch from 'react-select-search';
import 'react-select-search/style.css'


const ColaboradorSelect = () => {
    const options = [
        {name: 'Swedish', value: 'sv'},
        {name: 'English', value: 'en'},
        
    ];
    return (
        <div className="mb-3">
           <SelectSearch  options={options} search={true}  name="language" placeholder="Choose your language" />

            </div>

    );
}

export default ColaboradorSelect;

