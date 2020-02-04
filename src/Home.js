import React, { Component } from 'react';

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      // <div style={styles.background}>
      //   <div style={styles.horizontalBar}>
      //     Hello
      //   </div>
      // </div>
      <div>
        Welcome to the FPL site by Connor Inglis
      </div>
    )
  }
}

export default Home;

const styles = {
  background: {
    height: "100vh",
    background: "lightgrey",
  },
  horizontalBar: {
    height: "20vh",
    background: "green",
    width: "80vw",
    marginTop: "20vh",
  }
}