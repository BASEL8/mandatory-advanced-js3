import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import jwt from "jsonwebtoken";
import { token$, updateToken } from "../auth";
const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};
class Nav extends Component {
  state = {
    token: token$.value
  };
  componentDidMount() {
    this.subscription = token$.subscribe((token) => {
      this.setState({ token });
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }
  render() {
    const decoded = jwt.decode(this.state.token);
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                className={classes.menuButton}
                color="inherit"
                aria-label="Menu"
              />
              <Typography variant="h6" color="inherit" className={classes.grow}>
                TODO
              </Typography>
              <Typography variant="h6" color="inherit" className={classes.grow}>
                {this.state.token ? decoded.email : null}
              </Typography>

              {!this.state.token ? (
                <div>
                  <Button color="inherit">
                    <Link to="/login">login</Link>
                  </Button>
                  <Button color="inherit">
                    <Link to="/register">Register</Link>
                  </Button>
                </div>
              ) : null}
              {this.state.token ? (
                <div>
                  <Button color="inherit">
                    <Link to="/home">Home</Link>{" "}
                  </Button>
                  <Button color="inherit" onClick={() => updateToken(null)}>
                    Logout
                  </Button>
                </div>
              ) : null}
            </Toolbar>
          </AppBar>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Nav);
