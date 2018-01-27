import React, { Component } from 'react';
import { connect } from 'react-redux';
import setTodoListToStore from '../store/action/action.js';
import database from '../index.js';
import { Grid, Button, FormGroup, FormControl, ListGroup, ListGroupItem } from 'react-bootstrap';

class TodoApp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            todo_list: []
        };

        database.child("React Redux Todo List").on("child_added",
            (snapshot) => {
                let x = [];
                if (this.state.todo_list)
                    x = this.state.todo_list;
                x.push({ key: snapshot.key, value: snapshot.val(), edit: false })
                this.props.setTodoListToStore(x);
                //  console.log(this.state.todo_list)
            }
        );

        database.child("React Redux Todo List").on("child_changed",
            (snapshot) => {
                // console.log(this.state.todo_list)
                let x = this.state.todo_list, index;
                for (let i = 0; i < x.length; i++) {
                    if (x[i].key === snapshot.key && x[i].edit === true)
                        index = i;
                }
                // console.log(x[index]);
                x[index].value = snapshot.val();
                x[index].edit = false;
                this.props.setTodoListToStore(x);
                // console.log(this.state.todo_list);
            }
        );

        database.child("React Redux Todo List").on("child_removed",
            (snapshot) => {
                // console.log(snapshot.key, snapshot.val());
                // console.log(this.state.todo_list)
                let x = this.state.todo_list, index;
                for (let i = 0; i < x.length; i++) {
                    // console.log(x[i]);
                    // console.log({key: snapshot.key, value: snapshot.val(), edit: false});
                    if (x[i].key === snapshot.key && x[i].value === snapshot.val() && x[i].edit === false)
                        index = i;
                }
                // console.log(index);
                x.splice(index, 1);
                this.props.setTodoListToStore(x);
                // console.log(this.state.todo_list)
            }
        );

        this.add_todo_item = this.add_todo_item.bind(this);
        this.delete_all_todo_items = this.delete_all_todo_items.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ todo_list: [...nextProps.store_todo_list] });
        // console.log("State", this.state.todo_list);
        // console.log("Props", this.props.store_todo_list);
        // console.log("nextProps", nextProps.store_todo_list);
    }

    add_todo_item(e) {
        e.preventDefault();
        // console.log(this.refs.todo_item.value);
        database.child("React Redux Todo List").push(this.todo_item.value);
        this.todo_item.value = null;
    }

    delete_all_todo_items(e) {

        database.child(`React Redux Todo List`).remove();
    }

    edit_todo_item = (index, ev) => {
        // console.log(index, ev.target);
        let x = this.state.todo_list;
        // console.log(x[index].edit);
        x[index].edit = true;
        this.setState({ todo_list: x })
        // console.log(this.state.todo_list);
    }

    cancel_edit = (index, ev) => {
        // console.log(index, ev.target);
        let x = this.state.todo_list;
        // console.log(x[index].edit);
        x[index].edit = false;
        this.setState({ todo_list: x })
        // console.log(this.state.todo_list);
    }

    update_todo_item = (firebase_key, index, ev) => {
        ev.preventDefault();
        // console.log(index, ev.target);
        database.child(`React Redux Todo List/${firebase_key}`).set(this[`edit_item_${index}`].value);
        //console.log(this.state.todo_list);
    }

    delete_todo_item = (firebase_key, index, ev) => {
        //console.log(firebase_key, index, ev.target);
        database.child(`React Redux Todo List/${firebase_key}`).remove();
        // console.log(this.state.todo_list);
    }

    render() {
        return (
            <Grid fluid={true} className="text-center">
                <br />
                <form>
                    <FormGroup
                        controlId="formBasicText">
                        <FormControl
                            type="text"
                            placeholder="Enter text"
                            inputRef={ref => { this.todo_item = ref; }}
                        />
                    </FormGroup>
                    <Button bsStyle="success" type="submit" onClick={this.add_todo_item}>Add Todo</Button>
                    &nbsp;
                    <Button bsStyle="danger" onClick={this.delete_all_todo_items}>Delete All</Button>
                </form>
                <hr />
                <ListGroup>
                    {
                        this.state.todo_list.map((v, i) => {
                            return (
                                (!v.edit) ?
                                    <ListGroupItem key={i}>
                                        <p>{v.value}</p>
                                        &nbsp;
                                        <Button bsStyle="info" onClick={this.edit_todo_item.bind(this, i)}>Edit</Button>
                                        &nbsp;
                                        <Button bsStyle="warning" onClick={this.delete_todo_item.bind(this, v.key, i)}>Delete</Button>
                                    </ListGroupItem>
                                    :
                                    <ListGroupItem key={i} active>
                                        <form>
                                            <FormGroup
                                                controlId="formBasicText">
                                                <FormControl
                                                    type="text" 
                                                    defaultValue={v.value}
                                                    inputRef={ref => { this[`edit_item_${i}`] = ref; }}
                                                />
                                            </FormGroup>
                                            <Button bsStyle="primary" type="submit" onClick={this.update_todo_item.bind(this, v.key, i)}>Save</Button>
                                            &nbsp;
                                            <Button bsStyle="warning" onClick={this.cancel_edit.bind(this, v.key, i)}>Cancel</Button>
                                        </form>
                                    </ListGroupItem>
                            )
                        })
                    }
                </ListGroup>
            </Grid>
        )
    }
}

function mapStateToProp(state) {
    // console.log(state.root.store_todo_list);
    return ({
        store_todo_list: state.root.store_todo_list
    });
}
function mapDispatchToProp(dispatch) {
    return ({
        setTodoListToStore: (todo_list) => { dispatch(setTodoListToStore(todo_list)) }
    });
}

export default connect(mapStateToProp, mapDispatchToProp)(TodoApp);

