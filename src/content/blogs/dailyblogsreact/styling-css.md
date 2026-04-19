---
id: "styling-css"
title: "CSS in React"
slug: "styling-css"
description: "Use traditional CSS and CSS modules for component styling."
difficulty: "Beginner"
date: "2025-05-10"
author: "React Dev Team"
category: "React Beginner"
tags: ["CSS", "React", "Beginner", "Interview"]
related_questions: ["What are CSS modules and how are they used in React?", "How do you apply inline styles in React?", "What are the benefits of scoped CSS in React?"]
---

**CSS in React**
=====================================================

### Introduction
CSS is a crucial aspect of building robust and visually appealing React applications. As a beginner, understanding how to style your components using traditional CSS, CSS modules, and scoped CSS will help you create a solid foundation for your projects. In this post, we'll dive into the world of CSS in React and explore its benefits, best practices, and common questions.

### Prerequisites
Before we begin, make sure you have:

* Basic knowledge of JavaScript
* Set up with Vite or Create React App (optional but recommended)

For beginners, don't worry if these prerequisites seem overwhelming. We'll take it one step at a time, and I'll explain each concept in simple terms.

### Core Concepts
CSS in React allows you to style your components using traditional CSS, CSS modules, and scoped CSS. Here's an overview of each:

* **Traditional CSS**: You can use external CSS files or inline styles within your JSX components.
* **CSS Modules**: This feature enables you to write CSS rules specific to a single component, making it easier to manage styles.
* **Scoped CSS**: This allows you to define CSS rules for a specific component without affecting the global scope.

Let's build a simple todo app to demonstrate how these concepts work together. Imagine we have a `TodoItem` component that displays a task with an optional checkbox:
```jsx
// TodoItem.js
import React from 'react';

const TodoItem = ({ task, completed }) =&gt; {
  return (
    
      {task}
      {completed &amp;&amp; (
        
          [Completed]
        
      )}
    
  );
};

export default TodoItem;
```
We can use traditional CSS to style our components:
```css
/* styles.css */
.todo-item {
  font-size: 16px;
  margin-bottom: 10px;
}

.todo-item.completed {
  text-decoration: line-through;
}
```
Or, we can use CSS modules to create a scoped CSS file for our `TodoItem` component:
```css
/* TodoItem.module.css */
.todo-item {
  font-size: 16px;
  margin-bottom: 10px;
}

.todo-item-completed {
  text-decoration: line-through;
}
```
This allows us to keep our styles organized and avoid conflicts with other components.

### Code Examples
Let's explore some practical code examples:

* **Example 1**: Using traditional CSS for a simple button component:
```jsx
// Button.js
import React from 'react';

const Button = ({ children }) =&gt; {
  return (
    
      {children}
    
  );
};

export default Button;
```
* **Example 2**: Using CSS modules for a more complex component:
```jsx
// Card.js
import React from 'react';
import styles from './Card.module.css';

const Card = ({ title, description }) =&gt; {
  return (
    

      <h2>{title}</h2>
      <p>{description}</p>
    
  );
};

export default Card;
```
### Code Breakdown
Let's break down one of the code examples:

* **Example 1: Button Component**
We'll use traditional CSS to style our button component:
```jsx
// Button.js
import React from 'react';

const Button = ({ children }) =&gt; {
  return (
    
      {children}
    
  );
};

export default Button;
```
Here's a step-by-step breakdown of how the code works:

1. We define our `Button` component using JSX.
2. We use the `style` prop to apply inline styles to our button element.
3. The `backgroundColor` and `color` properties are set to specific values using CSS syntax.

### Visual Aids
No visual aids required for this topic.

### Best Practices
Here are some best practices for implementing CSS in React:

* **Use a consistent naming convention**: Use a consistent naming convention for your CSS classes and variables.
* **Keep styles organized**: Organize your styles by component or feature to reduce conflicts and improve maintainability.
* **Avoid global CSS**: Avoid using global CSS selectors whenever possible, as they can affect the entire application.

### Common Questions
**What are CSS modules and how are they used in React?**

CSS modules allow you to write CSS rules specific to a single component, making it easier to manage styles. You can use them by importing the CSS file into your component and using the class names defined in the CSS file.

**How do you apply inline styles in React?**

You can apply inline styles in React by using the `style` prop on an element. For example: `
`

**What are the benefits of scoped CSS in React?**

Scoped CSS allows you to define CSS rules for a specific component without affecting the global scope. This helps keep your styles organized and reduces conflicts between components.

### Further Reading
* **React documentation**: Check out the official React documentation for more information on using CSS in React.
* **CSS-Tricks**: Visit CSS-Tricks for a comprehensive guide to CSS, including tips and best practices.
* **Smashing Magazine**: Read Smashing Magazine's article on "Best Practices for Writing CSS" for additional tips and advice.

That's it! I hope you enjoyed this blog post and learned something new about using CSS in React. Happy coding!