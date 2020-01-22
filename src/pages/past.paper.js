import React, { useEffect, useState } from 'react'
import PageHeader from '../ui/page.header';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import fb from '../lib/firebase';
import PastPaperList from '../ui/selector.list';

export default () => {
  

  const [pastPapers, setPastPapers] = useState([]);

  useEffect(() => {
    fb.db.ref('past-papers').on('value', (snapshot)=> {
        console.log('Received Past Papers:', snapshot.val()['maths-igcse'])
        setPastPapers(snapshot.val()['maths-igcse']);
    });
  }, [])
  return (

  <Container>
    <PageHeader>Past Papers</PageHeader>
    <Grid container>
      <Grid item xs={4}>
  {pastPapers.map((pastPaper, index) => <div key={index}>{pastPaper.year}</div> )}
      </Grid>
      <Grid>
        Main Area Goes here.
      </Grid>
    </Grid>
  </Container>
  
)
}