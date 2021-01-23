import React, {useState, useRef, useEffect} from 'react';
import axios from 'axios';
import useDebounce from './hooks/useDebounce';
import './selector.css';

const Selector = () => {
  const [input, setInput] = useState('');
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const debouncedInput = useDebounce(input, 700);

  useEffect(()=>{
    if(debouncedInput){
      getClients(debouncedInput);
    }else{
      setSelected([]);
      setSelectedIds([]);
    }
  },[debouncedInput]);


  const getClients = async (value) => {
    const response = await axios.get(`http://localhost:3000/find?name=${value}`)
    setList(response.data);
  }

  const selectedList = (item) => {
    console.log('item : ',item);
    setSelectedIds(selectedIds => selectedIds.concat(item.id));
    setSelected(selected => selected.concat(item));
  }

  const isSelected = (id) => {
    if(!selectedIds || (selectedIds && !selectedIds.length)){
      return false;
    } 
    let isSelected = false;
    list.map((item)=>{
      isSelected = selectedIds.includes(id);
    });
    return isSelected;
  }

  const onRemove = (item)=>{
    setSelected(selected => selected.filter((selected)=>selected.id!=item.id));
    setSelectedIds(selectedIds => selectedIds.filter((id)=>id!=item.id));
  }

  return (<div className='selectContainer'>
    <div className='wrapper'>
    <div className="inputContainer"  >
      <div className="labelsContainer">
        {selected.map((item)=><SelectedLabel item={item} removeItem={onRemove} />)}
        <input className="input" type="text" onChange={(e)=>setInput(e.target.value)} value={input} />
      </div>
    </div>
      {input && (<div className="dropdown">
        {list.length>0 ? 
        list.map((item)=><option className={`option ${isSelected(item.id)&&'selected'}`} key={item.id} value={item.id} onClick={()=>selectedList(item)} >{item.name}</option>):
        <div className='noMatch'>No matches found!</div>}
      </div>)}     
    </div>
    
   
  </div>);
}

const SelectedLabel = ({item,removeItem})=>{
  return(
    <div className="selectedLabel" >
      <span className="name">{item.name}</span> <span className="remove" onClick={()=>removeItem(item)}>x</span>
    </div>
  )
}

export default Selector;