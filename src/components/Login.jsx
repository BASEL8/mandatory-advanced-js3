import React, { Component } from "react";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { updateToken } from "../auth";
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
class Login extends Component {
  state = {
    info: {
      email: "",
      password: ""
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
    this.source = axios.CancelToken.source();
    const { email, password } = this.state.info;
    axios
      .post(
        API_ROOT + "/auth",
        { email, password },
        {
          cancelToken: this.source.token
        }
      )
      .then((response) => {
        if (response.data.status) {
          updateToken(response.data.token);
          this.props.history.push("/home");
        }
      })
      .catch((er) => this.setState({ error: true }));
  };
  componentDidMount() {
    if (this.props.history.location.state !== undefined) {
      const { email, password } = this.props.history.location.state;
      const info = { email: email, password: password };
      this.setState({ info });
    }
  }
  componentWillUnmount() {
    if (this.source) {
      this.source.cancel();
    }
  }
  render() {
    const { classes } = this.props;
    const { email, password } = this.state.info;
    return (
      <form
        onSubmit={this.onSubmit}
        className={classes.container}
        noValidate
        autoComplete="off"
      >
        <h4>Login</h4>
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
          value={email}
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
          value={password}
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
          Login
        </Button>
      </form>
    );
  }
}

export default withStyles(styles)(Login);
