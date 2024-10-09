import './App.css';
import { FaTrashCan } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { useState, useRef, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import Swal from 'sweetalert2'
function App() {
  const [todolist, settodolist] = useState(() => {
    const storedList = localStorage.getItem('todolist');
    return storedList ? JSON.parse(storedList) : [];
  });
  const todo = useRef('')
  const [itemsleft, setitemsleft] = useState();

  const todostate = [{ state: 'all', id: '1' }, { state: 'active', id: '2' }, { state: 'Completed', id: '3' }]
  const [selectchoise, setselectchoise] = useState('1')
  const [fltertodo, setfiltertodo] = useState([]);
  useEffect(() => {
    window.localStorage.setItem('todolist', JSON.stringify(todolist));
    setitemsleft(todolist.length);

  }, [todolist]);


  function addtodo() {
    const newTodo = todo.current.value;


    if (newTodo.trim() !== '') {
      const todoExists = todolist.find((elt) => elt.todovalue === newTodo);

      if (todoExists) {
        toast.error('Todo already exists', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        todo.current.value = '';


      }
      else {
        settodolist(prevTodos => [...prevTodos, { id: todolist.length + 1, todovalue: newTodo, completed: false }]);
        setfiltertodo([])
        setselectchoise('1')
        todo.current.value = '';
        toast.success('Todo has been added successfully', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    }
  }
  function deletetodo(id) {
    settodolist(todolist.filter((elt) => elt.id !== id))
    setselectchoise('1')
    setfiltertodo([])
    toast.warning('Todo deleted successfully', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }
  function updaetodo(id) {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Update Your Todo ?",
      showCancelButton: true,
      input: "text",
      inputValue: todolist.find((elt) => elt.id === id).todovalue,

      inputAttributes: {
        min: "10",
        autocapitalize: "off",
        autocorrect: "off"
      },
      confirmButtonText: "Update",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedValue = result.value;
        if (updatedValue.trim() !== '') {
          const todoExists = todolist.find((elt) => elt.todovalue === updatedValue);
          setselectchoise('1')
          setfiltertodo([])
          if (todoExists) {
            toast.error('Todo already exists', {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
          else {
            settodolist(todolist.map((elt) => elt.id == id ? { ...elt, todovalue: updatedValue } : elt))
            swalWithBootstrapButtons.fire({
              title: "Updated!",
              text: "Your Todo has been Updated.",
              icon: "success"
            });
          }
        }

      }
    });

  }
  function todocomplete(id) {
    settodolist(todolist.map((elt) => elt.id == id ? { ...elt, completed: !elt.completed } : elt))

    setfiltertodo([])
    setselectchoise('1')

  }
  function cleartodo() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      closeOnClick: true,

    }).then((result) => {
      if (result.isConfirmed) {
        settodolist([])
        setfiltertodo([])
        todo.current.value = ''
        Swal.fire(
          'Clearred!',
          'Your file has been deleted.',
          'success'
        )
      }
    })

  }
  function changeChoice(e) {
    let choise = todostate.find((elt) => elt.id === e);
    const filteredActive = todolist.filter((item) => !item.completed);
    const filteredCompleted = todolist.filter((item) => item.completed);

    if (choise.state === 'active') {
      if (todolist.length > filteredCompleted.length) {
        setselectchoise(e)
        setfiltertodo(filteredActive);
        setitemsleft(filteredActive.length);


      }
    }
    else if (choise.state === 'Completed') {
      if (todolist.length > filteredActive.length) {
        setselectchoise(e);
        setfiltertodo(filteredCompleted);
        setitemsleft(filteredCompleted.length);


      }

    } else {
      setselectchoise(e);
      setfiltertodo([]);
      setitemsleft(todolist.length);
    }
  }

  return (

    <div className="App">
      <div>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

      </div>
      <div className='input' >
        <input type='text' ref={todo} required minLength='10' placeholder='Todo Info' />

        <p onClick={addtodo}>Add</p>
      </div>
      <div className='todolist'>
        <div className='todopadding'>
          {fltertodo.length ? fltertodo.map((elt) => {
            return (
              <div key={elt.id} className='todocontain'>
                <div className='todopara'>
                  <div className='inputdiv'  >
                    <input
                      onChange={() => todocomplete(elt.id)} style={{ cursor: 'pointer' }}
                      type='checkbox' checked={elt.completed} />
                  </div>
                  <p className={elt.completed ? "todocomplete" : ""}>{elt.todovalue}</p>

                </div>
                <div className='icons'><i className="fas fa-trash-alt"></i>
                  < FaTrashCan
                    className='trashicon' onClick={() => deletetodo(elt.id)} />
                  <FaEdit className='editicon' onClick={() => updaetodo(elt.id)} />

                </div>
              </div>
            )
          }) : todolist.map((elt) => {
            return (
              <div key={elt.id} className='todocontain'>
                <div className='todopara'>
                  <div className='inputdiv'>
                    <input className='custom-checkbox'
                      onChange={() => todocomplete(elt.id)} style={{ cursor: 'pointer' }}
                      type='checkbox' checked={elt.completed} />
                  </div>
                  <p className={elt.completed ? "todocomplete" : ""}>{elt.todovalue}</p>

                </div>
                <div className='icons'><i className="fas fa-trash-alt"></i>
                  < FaTrashCan
                    className='trashicon' onClick={() => deletetodo(elt.id)} />
                  <FaEdit className='editicon' onClick={() => updaetodo(elt.id)} />

                </div>
              </div>
            )
          })}
        </div>
        {todolist.length > 0 && (<div className='footer'>
          <div className='todoleft'>{itemsleft} items left</div>
          <div className='choise'>{todostate.map((elt) => <span key={elt.id} onClick={() => changeChoice(elt.id)}
            className={elt.id === selectchoise ? 'activechoise' : ''}>{elt.state}</span>)}</div>
          <div className='cleartodo' onClick={cleartodo}> Clear all</div>

        </div>)}
      </div>

    </div>
  );
}

export default App;
