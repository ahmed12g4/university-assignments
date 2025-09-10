import './footer.css'

export const Footer = () => {
    return (
        <footer className="flex flex-wrap items-center justify-between gap-4 pt-4">
            {/* <p className="text-base font-medium text-slate-900 dark:text-slate-50">© 2024 X Code All Rights Reserved</p> */}

            <p className="footer-copyright">
                &copy; 2025 | All rights reserved. Made by{" "}
                <a
                    href="https://ahmed12g4.github.io/My-Portfolio/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <strong className="text-primary">Ahmed Seleem</strong>
                </a>
            </p>
            <div className="flex flex-wrap gap-x-2">
                <a
                    href="#"
                    className="link"
                >
                    Privacy Policy
                </a>
                <a
                    href="#"
                    className="link"
                >
                    Terms of Service
                </a>
            </div>
        </footer>
    );
};
