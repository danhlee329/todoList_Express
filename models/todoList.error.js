const TodoListErrorCodes = {
    UUID_REQUIRED: 'List ID must be a valid UUID',
    NAME_STRING_REQUIRED: 'List name must be a non-empty string',
    DESCRIPTION_STRING_TYPE: 'List description must be a string',
    TASK_LIST_TYPE: 'List task list must be an array',
    TASK_LIST_INIT_ERROR: 'List of tasks are invalid',
    ADD_TASK_TYPE: 'The task must be a type \'Task\'',
    ADD_TASK_UNIQUE: 'A task with the same id or name exists.  Please rename the task.',
    COMPLETE_ID: 'Task ID must be a non-empty string',
    TASK_NOT_FOUND: 'Task is not found in list',
}

module.exports = TodoListErrorCodes;