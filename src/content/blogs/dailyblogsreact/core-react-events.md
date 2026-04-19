---
id: "core-react-events"
title: "Event Handling"
slug: "core-react-events"
description: "Handle user interactions like clicks and form submissions in React."
difficulty: "Beginner"
date: "2025-05-10"
author: "React Dev Team"
category: "React Beginner"
tags: ["Events", "React", "Beginner", "Interview"]
related_questions: ["How do you handle events in React?", "What is event delegation in React?", "How do you prevent default behavior in a form submission?"]
---

**Core React Events**
================================

### Introduction
Handling events in React is crucial to create interactive and engaging user interfaces. As a React developer, you'll frequently encounter situations where you need to respond to user interactions like clicks, form submissions, or key presses. In this article, we'll explore the fundamentals of event handling in React, covering both the basics and advanced concepts.

### Prerequisites
Before diving into events, make sure you have a solid grasp of:

* JavaScript basics: Familiarize yourself with variables, data types, functions, and control structures.
* React setup with Vite or Create React App: Understand how to create a new React project using popular build tools like Vite or Create React App.

### Core Concepts
Event handling in React revolves around the concept of event listeners. An event listener is a function that's called when a specific event occurs, such as a mouse click or form submission. To handle events, you'll use JSX components and React hooks to create interactive UI elements.

Real-world Example: Building a Todo App
-----------------------------------------

Let's create a simple todo app that allows users to add, remove, and edit tasks. We'll focus on handling the `submit` event for our todo form:
```jsx
import { useState } from 'react';

function TodoForm() {
  const [task, setTask] = useState('');
  const handleFormSubmit = (event) =&gt; {
    // Prevent default form submission behavior
    event.preventDefault();
    console.log('Form submitted with task:', task);
  };

  return (
    
       setTask(event.target.value)} /&gt;
      Add Task
    
  );
}
```
In this example, we use the `useState` hook to manage the task input state. The `handleFormSubmit` function is called when the form is submitted, and it prevents the default form submission behavior using `event.preventDefault()`.

### Code Examples
Here are two more code examples that demonstrate event handling in React:

**Example 2: Handling Click Events**
```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () =&gt; {
    setCount(count + 1);
  };

  return (
    

      <p>Count: {count}</p>
      Increment
    
  );
}
```
**Example 3: Handling Keyboard Events**
```jsx
import { useState } from 'react';

function AutoFocusInput() {
  const [focused, setFocused] = useState(false);

  const handleKeyDown = (event) =&gt; {
    if (event.key === 'Enter') {
      setFocused(true);
    }
  };

  return (
     setFocused(true)} onBlur={() =&gt; setFocused(false)} onKeyDown={handleKeyDown} /&gt;
  );
}
```
### Code Breakdown
Let's dive deeper into the `TodoForm` example:

1. We define a `handleFormSubmit` function that will be called when the form is submitted.
2. Inside the `handleFormSubmit` function, we call `event.preventDefault()` to prevent the default form submission behavior.
3. We log a message to the console with the task input value.

### Visual Aids
No visual aids required for this topic.

### Best Practices

* Always use the `preventDefault()` method when handling events to avoid unexpected behavior.
* Use event listeners sparingly and only when necessary, as excessive event handling can impact performance.
* Keep your event handlers concise and focused on a specific task or functionality.

### Common Questions
#### How do you handle events in React?
You handle events by attaching an event listener (a function) to a JSX component using the `on` prop. When the event occurs, the attached function is called.

#### What is event delegation in React?
Event delegation is a technique where you attach an event listener to a parent element and then use event.target or event.currentTarget to determine which child element triggered the event. This approach can improve performance by reducing the number of event listeners needed.

#### How do you prevent default behavior in a form submission?
You can prevent the default form submission behavior using the `event.preventDefault()` method, as shown in the `TodoForm` example.

### Further Reading
* React documentation: [Events](https://reactjs.org/docs/events.html)
* "React Hooks in Action" by Matt Pocock (Chapter 3: Handling Events with useState and useEffect)

By mastering event handling in React, you'll be well-equipped to build interactive and engaging user interfaces that respond to user interactions. Remember to follow best practices, use event delegation when necessary, and prevent default behavior where required. Happy coding!