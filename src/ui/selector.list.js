import React from 'react'
import Button from '@material-ui/core/Button';

import styled from 'styled-components'

const UserButtonList = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 90px);
  overflow: auto;
`
export default ({items, onItemSelected, displayItem}) => {
  
  console.log('items', items)
  
  if (!items)
    return (<div>Waiting for Data</div>)
  return (
    <UserButtonList>
    {items.map((item, index) => (
      <Button key={index} onClick={() => onItemSelected(item)}>
          {displayItem(item)}
      </Button>
    ))
    }
    </UserButtonList>
  );
}