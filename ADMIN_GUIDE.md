# Admin Panel Guide

This guide will help you set up and use the admin panel for your portfolio website.

## Setting Up an Admin User

Before you can access the admin panel, you need to create an admin user. You can do this by running:

```bash
pnpm create-admin
```

Follow the prompts to enter your email, password, and name. This will create an admin user in the database.

## Accessing the Admin Panel

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Navigate to `/admin/login` in your browser.

3. Log in with the email and password you created.

## Managing Content

### Projects

- **View Projects**: The projects page shows all your projects.
- **Add Project**: Click the "Add New Project" button to create a new project.
- **Edit Project**: Click the "Edit" button on a project card to modify it.
- **Delete Project**: Click the "Delete" button to remove a project.

### Skills

- **View Skills**: The skills page shows all your skills.
- **Add Skill**: Click the "Add New Skill" button to create a new skill.
- **Edit Skill**: Click the "Edit" button on a skill card to modify it.
- **Delete Skill**: Click the "Delete" button to remove a skill.

### About Me

- **View About**: The about page shows your current profile information.
- **Edit About**: Click the "Edit" button to modify your profile information.

### Contact Messages

- **View Messages**: The dashboard shows recent contact messages.
- **Mark as Read**: Click on a message to mark it as read.
- **Delete Message**: Click the "Delete" button to remove a message.

## Security Notes

- Keep your admin credentials secure.
- Change your password regularly.
- Log out when you're done using the admin panel. 