import React, { Component } from "react";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
const API_ROOT = "http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000";
const styles = (theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  }
});
class Register extends Component {
  state = {
    info: {
      email: null,
      password: null
    },
    error: false
  };

  onChange = ({ currentTarget: input }) => {
    const { name, value } = input;
    const info = { ...this.state.info };
    info[name] = value;
    this.setState({ info });
  };
  onSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state.info;
    axios
      .post(API_ROOT + "/register", { email: email, password: password })
      .then((response) => {
        if (response.data.status === "success") {
          this.props.history.push({
            pathname: "/login",
            state: {
              email: email,
              password: password
            }
          });
        }
      })
      .catch((er) => this.setState({ error: true }));
  };
  render() {
    const { classes } = this.props;
    return (
      <form
        onSubmit={this.onSubmit}
        className={classes.container}
        noValidate
        autoComplete="off"
      >
        <h4>Register</h4>

        <TextField
          id="outlined-email-input"
          label="Email"
          className={classes.textField}
          type="email"
          name="email"
          autoComplete="email"
          margin="normal"
          variant="outlined"
          onChange={this.onChange}
        />

        <TextField
          id="outlined-password-input"
          label="Password"
          className={classes.textField}
          type="password"
          name="password"
          autoComplete="current-password"
          margin="normal"
          variant="outlined"
          onChange={this.onChange}
        />
        {this.state.error ? (
          <p style={{ color: "red" }}>please try agin</p>
        ) : null}
        <Button
          onClick={this.onSubmit}
          variant="contained"
          color="primary"
          className={classes.button}
        >
          Register
        </Button>
      </form>
    );
  }
}

export default withStyles(styles)(Register);
