import tkinter as tk
from tkinter import ttk
import datetime

"""
KEYBOARD EVENT VISUALIZER - EDUCATIONAL DEMO
---------------------------------------------
This script is for educational purposes only. It demonstrates how GUI frameworks 
capture and process keyboard events within their own window context.

ETHICAL RESTRICTIONS & COMPLIANCE:
1. NO BACKGROUND CAPTURE: This app only listens when the window is in focus.
2. NO DATA PERSISTENCE: Events are stored only in volatile memory (RAM).
3. NO NETWORK: This application has NO networking capabilities.
4. TRANSPARENCY: User is informed of all tracking via a giant red banner.
5. NO HIDDEN MODE: The application cannot hide itself from the taskbar.
"""

class KeyboardVisualizer:
    def __init__(self, root):
        self.root = root
        self.root.title("Educational Keyboard Event Visualizer")
        self.root.geometry("800x600")
        
        # Application State
        self.is_running = False
        self.key_count = 0
        
        # Styling Setup (Dark Mode)
        self.setup_styles()
        
        # UI Layout
        self.create_widgets()
        
    def setup_styles(self):
        """Configures the dark mode appearance of the application."""
        self.root.configure(bg="#1e1e1e")
        style = ttk.Style()
        style.theme_use('clam')
        
        # Styles for various elements
        style.configure("TFrame", background="#1e1e1e")
        style.configure("TLabel", background="#1e1e1e", foreground="#ffffff")
        style.configure("Red.TLabel", background="#ff0000", foreground="#ffffff", font=("Helvetica", 16, "bold"))
        style.configure("Header.TLabel", font=("Courier", 24, "bold"), foreground="#ff3b3b")
        style.configure("Stats.TLabel", font=("Courier", 14), foreground="#00ff00")
        
    def create_widgets(self):
        """Builds the GUI layout using Tkinter widgets."""
        
        # 1. LARGE RED BANNER (Required Security Notification)
        self.banner = tk.Label(
            self.root, 
            text="⚠️ EDUCATIONAL KEYBOARD EVENT DEMO ONLY", 
            bg="#d32f2f", 
            fg="white", 
            font=("Helvetica", 14, "bold"),
            pady=10
        )
        self.banner.pack(fill=tk.X)
        
        # Main Container
        self.main_container = tk.Frame(self.root, bg="#1e1e1e", padx=20, pady=20)
        self.main_container.pack(fill=tk.BOTH, expand=True)
        
        # Header & Controls
        header_frame = tk.Frame(self.main_container, bg="#1e1e1e")
        header_frame.pack(fill=tk.X)
        
        tk.Label(header_frame, text="KEYBOARD_VIZ_PY", font=("Courier", 24, "bold"), bg="#1e1e1e", fg="#ff3b3b").pack(side=tk.LEFT)
        
        self.control_btn = tk.Button(
            header_frame, 
            text="START DEMO", 
            command=self.toggle_demo,
            bg="#4caf50", 
            fg="white", 
            font=("Helvetica", 10, "bold"),
            padx=20,
            relief=tk.FLAT
        )
        self.control_btn.pack(side=tk.RIGHT)

        # Dashboard View (Current Key & Count)
        self.display_frame = tk.Frame(self.main_container, bg="#121212", pady=40, relief=tk.SUNKEN, borderwidth=2)
        self.display_frame.pack(fill=tk.X, pady=20)
        
        self.current_key_label = tk.Label(
            self.display_frame, 
            text="_", 
            font=("Helvetica", 72, "bold"), 
            bg="#121212", 
            fg="#ff3b3b"
        )
        self.current_key_label.pack()
        
        self.stats_label = tk.Label(
            self.main_container, 
            text="TOTAL EVENTS: 0000", 
            bg="#1e1e1e", 
            fg="#666666", 
            font=("Courier", 12)
        )
        self.stats_label.pack(anchor=tk.W)

        # Scrolling Event Log Panel
        tk.Label(self.main_container, text="LIVE_EVENT_LOG.txt", bg="#1e1e1e", fg="#444444", font=("Courier", 10, "bold")).pack(anchor=tk.W, pady=(20, 5))
        
        self.log_container = tk.Frame(self.main_container, bg="#121212")
        self.log_container.pack(fill=tk.BOTH, expand=True)
        
        self.log_display = tk.Text(
            self.log_container, 
            bg="#000000", 
            fg="#00ff00", 
            font=("Courier", 10),
            padx=10,
            pady=10,
            relief=tk.FLAT,
            state=tk.DISABLED # Read-only
        )
        self.log_display.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        scrollbar = tk.Scrollbar(self.log_container, command=self.log_display.yview)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.log_display.config(yscrollcommand=scrollbar.set)

    def toggle_demo(self):
        """Starts or stops the event tracking demo."""
        self.is_running = not self.is_running
        
        if self.is_running:
            self.control_btn.config(text="STOP DEMO", bg="#f44336")
            self.banner.config(bg="#f44336")
            # LISTENERS: Bind the <Key> event to the root window
            # This is how Tkinter captures keyboard input centrally
            self.root.bind("<Key>", self.on_key_press)
            self.write_log("--- NEW SESSION INITIALIZED ---")
        else:
            self.control_btn.config(text="START DEMO", bg="#4caf50")
            self.banner.config(bg="#d32f2f")
            # REMOVE LISTENERS: Unbind to stop event capture
            self.root.unbind("<Key>")
            self.write_log("--- SESSION TERMINATED ---")

    def on_key_press(self, event):
        """
        Event Handler: Called every time a key is pressed while app has focus.
        Arguments:
            event: A Tkinter Event object containing key details.
        """
        if not self.is_running:
            return
            
        timestamp = datetime.datetime.now().strftime("%H:%M:%S")
        key_name = event.keysym
        
        # Update main display
        self.current_key_label.config(text=key_name)
        
        # Update Count
        self.key_count += 1
        self.stats_label.config(text=f"TOTAL EVENTS: {self.key_count:04d}")
        
        # Log to the scrollable panel
        log_entry = f"[{timestamp}] ID:{id(event)} KEY:{key_name:<10} SYM:{event.keysym_num}\n"
        self.write_log(log_entry)

    def write_log(self, text):
        """Helper to append text to the read-only scrolling log."""
        self.log_display.config(state=tk.NORMAL)
        self.log_display.insert(tk.END, text + "\n")
        self.log_display.see(tk.END) # Scroll to bottom
        self.log_display.config(state=tk.DISABLED)

if __name__ == "__main__":
    # GUI LOOP: The mainloop() function starts the event-driven execution.
    # It waits for events (mouse clicks, key presses) and calls their handlers.
    root = tk.Tk()
    app = KeyboardVisualizer(root)
    root.mainloop()
