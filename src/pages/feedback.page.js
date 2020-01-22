import React, {useEffect, useState} from 'react'
import PageHeader from '../ui/page.header'
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import fb from '../lib/firebase';
import UserList from '../ui/selector.list';

export default () => {

  const [users, setUsers] = useState([]);
  const [cohorts, setCohorts] = useState([]);

  const [cohort, setCohort] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [moduleId, setModuleId] = useState('')

  useEffect(()=> {
    fb.db.ref('users').on('value', (snapshot) => {
      setUsers(Object.values(snapshot.val()));
    });

    fb.db.ref('cohorts').on('value', (snapshot) => {
      console.log(`Cohorts`, Object.values(snapshot.val()))
      setCohorts(snapshot.val());
      setCohort(Object.keys(snapshot.val())[0])
    });

  }, []);

  console.log('Current Cohort', cohorts[cohort])
  
  if (cohorts && cohorts[cohort] && cohorts[cohort].modules) 
    console.log('Current Modules', cohorts[cohort].modules) 
  else 
    console.log('No Modules Found')

  return (
  <Container>
    <div style={{display: 'flex'}}>
      <PageHeader style={{flex: 1}}>Feedback Admin</PageHeader>
      <div style={{paddingTop: '5px', marginRight: '20px'}}>Cohort:</div>
      
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <CohortSelect cohorts={Object.keys(cohorts)} value={cohort} onChange={setCohort}/>
        {(cohorts && cohort  && cohorts[cohort].modules) ? 
            <ModuleSelect modules={Object.keys(cohorts[cohort].modules)}
                          value={moduleId}
                          onChange={setModuleId}
            /> :  
            <div>Loading</div>
        }
      </div>
      
    </div>
    
    <Grid container>
      <Grid item xs={4}>
        <UserList items={users.filter((u) => u.cohort === cohort)} 
                  onItemSelected={(user) => setSelectedUser(user)}
                  displayItem={(user) => `${user.firstName} ${user.familyName}`}
        />
      </Grid>
      <Grid item xs={8}>
        {
        (selectedUser) ?
        <EditAssessment userId={selectedUser.uid} moduleId={moduleId}/> : 
        <div>No User Selected</div>
        }

      </Grid>
    </Grid>
  </Container>
  )
}

const CohortSelect = ({cohorts, value, onChange}) => (
    <Select value={value} 
            onChange={(e) => onChange(e.target.value)} 
            SelectDisplayProps={{style: {fontSize: '2rem'}}}
            >
      {cohorts.map((cohort, index) => (
        <MenuItem key={index} value={cohort}>{cohort}</MenuItem>
      ))}
    </Select>
)

const ModuleSelect = ({modules, moduleId, onChange}) => {
  console.log(modules)
  return (
  <Select
        value={moduleId}
        onChange={(e) => onChange(e.target.value)}
        SelectDisplayProps={{style: {fontSize: '1.5rem'}}}>
    <MenuItem key={-1}value="">None Selected</MenuItem>
    {modules.map((module, index) => (<MenuItem key={index} value={module}>{module}</MenuItem>))}
  </Select>
)}

const EditAssessment = ({userId, moduleId}) => {

  
  const [user, setUser] = useState(null);
  const [feedback, setFeedback] = useState('');

  const getFeedback = (user, moduleId) => (
    (user && 
    user.assessments && 
    user.assessments[moduleId] && 
    user.assessments[moduleId].feedback) ? 
    user.assessments[moduleId].feedback : 
    ''
  )

  useEffect(() => {
    fb.db.ref('users').child(userId).on('value', (snapshot) => {
      console.log(snapshot.val())
      setUser(snapshot.val())
    })
  }, [userId]);

  useEffect(() => {
    setFeedback(getFeedback(user, moduleId))
  }, [user, moduleId]);



  if (!user)
    return (<div>No User Selected</div>)

  if (!moduleId)
    return (<div>No Module Selected</div>)

  const updateLevel = (e) => {
    console.log('Updating to ', e.target.value)
    fb.db.ref('users')
        .child(userId)
        .child('assessments')
        .child(moduleId)
        .child('level')
        .set(e.target.value)
  }

  const updateFeedback = (value) => {
    fb.db.ref('users')
        .child(userId)
        .child('assessments')
        .child(moduleId)
        .child('feedback')
        .set(value)
  } 

  const level = (user && 
                 user.assessments && 
                 user.assessments[moduleId] && 
                 user.assessments[moduleId].level) ? user.assessments[moduleId].level : ''
  
  console.log(`Level is ${level}`)
  
  

  return (
    <div>
<div>{user.firstName}, {user.uid}</div>
      <div>{moduleId}</div>
      <div style={{marginTop: '15px'}}>
        <TextField style={{width: '150px'}}variant='outlined' select value={level} onChange={updateLevel} label="Level">
          <MenuItem value="">No Level Found</MenuItem>
          <MenuItem value="3C">3C</MenuItem>
          <MenuItem value="3B">3B</MenuItem>
          <MenuItem value="3A">3A</MenuItem>
          <MenuItem value="4C">4C</MenuItem>
          <MenuItem value="4B">4B</MenuItem>
          <MenuItem value="4A">4A</MenuItem>
          <MenuItem value="5C">5C</MenuItem>
          <MenuItem value="5B">5B</MenuItem>
          <MenuItem value="5A">5A</MenuItem>
        </TextField>
      </div>
      <div style={{marginTop: '15px'}}>
        <TextField value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              onBlur={(e) => {updateFeedback(e.target.value)}}
              style={{width: '100%'}} 
              variant='outlined' 
              multiline rows={8} 
              label="Feedback">

        </TextField>
      </div>
    </div>
  )

}