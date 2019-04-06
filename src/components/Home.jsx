import React, { Component } from "react";
import { token$, updateToken } from "../auth";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const API_ROOT = "http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000";

const styles = (theme) => ({
  mainContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    overflow: "scroll"
  },
  root: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column"
  },
  chip: {
    margin: theme.spacing.unit,
    padding: "25px 10px",
    display: "flex",
    justifyContent: "space-between"
  },
  form: {
    display: "flex"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  }
});
class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: token$.value,
      todos: null,
      value: "",
      error: false
    };
  }

  componentDidMount() {
    this.subscription = token$.subscribe((token) => {
      this.setState({ token });
    });

    this.source = axios.CancelToken.source();

    axios
      .get(API_ROOT + "/todos", {
        cancelToken: this.source.token,
        headers: {
          Authorization: `bearer ${token$.value}`
        }
      })
      .then((response) => {
        this.setState({ todos: [...response.data.todos] });
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          return;
        }
        updateToken(null);
      });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        API_ROOT + "/todos",
        { content: this.state.value },
        {
          headers: {
            Authorization: "Bearer " + token$.value,
            cancelToken: this.source.token
          }
        }
      )
      .then((response) => {
        if (response.data.status === "success") {
          const todos = [...this.state.todos];
          todos.push(response.data.todo);
          this.setState({ todos: todos, value: "", error: false });
        }
      })
      .catch((er) => this.setState({ error: true }));
  };

  componentWillUnmount() {
    this.source.cancel();
    this.subscription.unsubscribe();
  }
  handleDelete = (id) => {
    const todos = Object.keys([...this.state.todos])
      .map((key) => [...this.state.todos][key])
      .filter((todo) => todo.id !== id);
    axios
      .delete(API_ROOT + "/todos/" + id, {
        headers: {
          Authorization: "Bearer " + token$.value,
          cancelToken: this.source.token
        }
      })
      .then((data) => {
        this.setState({ todos });
      });
  };

  render() {
    const { token, todos, value } = this.state;
    if (!token) {
      return <Redirect to="/login" />;
    }

    return (
      <div className={this.props.classes.mainContainer}>
        <div className={this.props.classes.root}>
          {todos ? (
            todos.length === 0 ? (
              "add todos...!"
            ) : (
              todos.map((todo) => (
                <Chip
                  label={todo.content}
                  key={todo.id}
                  onDelete={() => this.handleDelete(todo.id)}
                  className={this.props.classes.chip}
                  color="secondary"
                />
              ))
            )
          ) : (
            <p>Loading profile...</p>
          )}
        </div>
        <form onSubmit={this.handleSubmit} className={this.props.classes.form}>
          <TextField
            id="outlined-full-width"
            label="Add Todo"
            style={{ margin: 8 }}
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              shrink: true
            }}
            className={this.props.classes.textField}
            value={value}
            onChange={(e) => this.setState({ value: e.target.value })}
          />
          <Button
            variant="outlined"
            color="primary"
            className={this.props.classes.button}
            onClick={() => this.handleSubmit}
          >
            Add
          </Button>
          {this.state.error ? (
            <p style={{ color: "red" }}>please try agin</p>
          ) : null}
        </form>
      </div>
    );
  }
}

export default withStyles(styles)(Home);
