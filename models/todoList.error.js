const TodoListErrorCodes = {
    NAME_STRING_REQUIRED: 'List Name must be a non-empty string',
    ADD_TASK_TYPE: 'The task must be a type \'Task\'',
    ADD_TASK_UNIQUE: 'A task with the same id or name exists.  Please rename the task.',
    COMPLETE_ID: 'Task ID must be a non-empty string',
    TASK_NOT_FOUND: 'Task is not found in list',
}

module.exports = TodoListErrorCodes;