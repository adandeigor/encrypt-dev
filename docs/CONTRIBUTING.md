# Contributing to envsync-cli

Thank you for your interest in contributing to `envsync-cli`! We welcome contributions from the community to improve this tool for securely managing and sharing encrypted environment variables. Whether you're fixing bugs, adding features, improving documentation, or reporting issues, your help is greatly appreciated.

This document outlines the process for contributing to `envsync-cli`. Please read it carefully to ensure a smooth collaboration.

## Table of Contents

- Code of Conduct
- How Can I Contribute?
  - Reporting Bugs
  - Suggesting Features
  - Contributing Code
  - Improving Documentation
- Setting Up the Development Environment
- Submitting Changes
- Style Guidelines
- Testing
- Review Process
- Community

## Code of Conduct

We are committed to fostering an open and inclusive community. All contributors are expected to adhere to our Code of Conduct. Please treat everyone with respect and report any unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

If you find a bug in `envsync-cli`, please report it by opening an issue on the GitHub Issues page. Include the following details:

- A clear title describing the issue.
- Steps to reproduce the bug.
- Expected behavior.
- Actual behavior.
- Environment details (Node.js version, OS, `envsync-cli` version).
- Any relevant logs or screenshots.

Example:

```
Title: `envsync decrypt` fails with invalid passphrase

Description:
When running `envsync decrypt` with an incorrect passphrase, the error message is unclear.

Steps to Reproduce:
1. Run `envsync encrypt` with passphrase `test`.
2. Run `envsync decrypt` with passphrase `wrong`.
3. Observe the error.

Expected Behavior:
A clear message like "Invalid passphrase provided."

Actual Behavior:
Generic error: "Decryption failed: Unknown error."

Environment:
- Node.js: v20.10.0
- OS: Ubuntu 22.04
- envsync-cli: v1.0.0
```

### Suggesting Features

We welcome ideas for new features or improvements! To suggest a feature:

1. Open an issue on the GitHub Issues page.
2. Use a clear title (e.g., "Add support for multiple .encryptenv files").
3. Describe the feature, its use case, and potential implementation ideas.
4. Label the issue as `enhancement`.

Example:

```
Title: Add support for environment-specific .encryptenv files

Description:
It would be useful to support multiple .encryptenv files (e.g., .encryptenv.dev, .encryptenv.prod) for different environments.

Use Case:
- Developers can manage separate variables for development and production.
- Simplifies CI/CD workflows with environment-specific configurations.

Proposed Implementation:
- Update `envsync.config.json` to include an array of encrypted files.
- Modify `encrypt`, `decrypt`, and `status` to accept a `--env` flag.
```

### Contributing Code

To contribute code (bug fixes, features, etc.):

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/<feature-name>
   ```

   or for a bug fix:

   ```bash
   git checkout -b bugfix/<bug-name>
   ```
3. Make your changes, following the Style Guidelines.
4. Write or update tests to cover your changes.
5. Run tests to ensure everything passes:

   ```bash
   npm test
   ```
6. Commit your changes with a clear message (see Submitting Changes).
7. Push to your fork and submit a pull request.

### Improving Documentation

Documentation is critical for `envsync-cli`. You can:

- Fix typos or clarify sections in `README.md` or other docs.
- Add examples or tutorials.
- Translate documentation to other languages.

To contribute to documentation, follow the same process as for code contributions, but focus on files like `README.md` or `docs/`.

## Setting Up the Development Environment

1. **Fork and clone the repository**:

   ```bash
   git clone https://github.com/adandeigor/envsync-cli.git
   cd envsync-cli
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Build the project**:

   ```bash
   npm run build
   ```

4. **Link the CLI locally** (optional, for testing `envsync` commands):

   ```bash
   npm link
   ```

5. **Verify setup**:

   ```bash
   envsync --help
   npm test
   ```

6. **Development tools**:

   - **Node.js**: Version 16 or higher.
   - **TypeScript**: For compiling source code.
   - **Jest**: For running tests.
   - **Dependencies**: Listed in `package.json` (e.g., `commander`, `inquirer`, `qrcode`).

## Submitting Changes

1. **Write clear commit messages**:

   - Use the present tense (e.g., "Add feature" not "Added feature").
   - Include a short description and details if needed.
   - Reference related issues (e.g., "Fix #123").
   - Example:

     ```
     Add support for custom config paths
     
     - Update `init` command to accept a `--config` flag.
     - Add tests for custom config paths.
     - Fixes #123
     ```

2. **Push to your fork**:

   ```bash
   git push origin feature/<feature-name>
   ```

3. **Open a pull request**:

   - Go to the GitHub repository.
   - Create a pull request from your branch to the main repository's `main` branch.
   - Include a clear title and description:
     - What does the PR do?
     - Why is it needed?
     - Any testing instructions or screenshots.
   - Reference related issues (e.g., "Closes #123").

4. **Sign your commits** (optional but recommended):

   - Use GPG to sign commits for security:

     ```bash
     git commit -S -m "Your message"
     ```

## Style Guidelines

- **Code**:

  - Follow TypeScript best practices.
  - Use 2 spaces for indentation.
  - Run `npm run lint` (if a linter is configured) or ensure consistent formatting.
  - Add JSDoc comments for functions and complex logic.
  - Example:

    ```typescript
    /**
     * Encrypts a file using AES-256-CBC.
     * @param data - The data to encrypt.
     * @param passphrase - The encryption passphrase.
     * @returns The encrypted data object.
     */
    function encrypt(data: string, passphrase: string): EncryptedData {
      // ...
    }
    ```

- **Tests**:

  - Write tests for all new features and bug fixes.
  - Place tests in `tests/` with the same structure as `src/` (e.g., `tests/utils/crypto.test.ts`).
  - Use Jest conventions (e.g., `describe`, `it`, `expect`).
  - Ensure 100% test coverage for critical paths (e.g., encryption, decryption).

- **Commits**:

  - Keep commits small and focused.
  - Separate code changes from formatting or documentation updates.

- **Documentation**:

  - Use clear, concise language.
  - Follow Markdown conventions.
  - Update `README.md` for any new features or changes.

## Testing

All contributions must include tests to maintain code quality.

1. **Run tests**:

   ```bash
   npm test
   ```

2. **Write tests**:

   - Use Jest for unit and integration tests.
   - Mock dependencies like `fs` and `inquirer` where necessary.
   - Example:

     ```typescript
     describe('encrypt', () => {
       it('encrypts and decrypts correctly', () => {
         const data = 'KEY=VALUE';
         const passphrase = 'test';
         const encrypted = encrypt(data, passphrase);
         const decrypted = decrypt(encrypted, passphrase);
         expect(decrypted).toBe(data);
       });
     });
     ```

3. **Check coverage**:

   ```bash
   npm test -- --coverage
   ```

   Aim for high coverage, especially for `src/utils/crypto.ts` and `src/utils/file.ts`.

## Review Process

- **Pull Request Review**:

  - Maintainers will review your pull request within a few days.
  - Expect feedback on code quality, tests, or documentation.
  - Address feedback by pushing additional commits to your branch.

- **Approval**:

  - A pull request requires at least one maintainer approval.
  - Tests must pass (via CI if configured).
  - The PR will be merged into `main` once approved.

- **Rejections**:

  - If a PR doesn't align with the project's goals, it may be closed with an explanation.
  - You're welcome to discuss or propose alternatives.

## Community

Join our community to discuss `envsync-cli`:

- **GitHub Issues**: For bugs, features, and questions.
- **GitHub Discussions** (if enabled): For general ideas and feedback.
- **Contact**: Reach out to maintainers via GitHub or email (if provided).

We value your contributions and look forward to building `envsync-cli` together!