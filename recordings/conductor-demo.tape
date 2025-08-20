# VHS tape file for Conductor CLI demo
# This records the main demo workflow from the README

Output conductor-demo.gif
Set Theme "Dracula"
Set FontSize 14
Set Width 1200
Set Height 800
Set LoopOffset 20%
Set Shell bash
Set TypingSpeed 0.1
Set PlaybackSpeed 1.0

# Hide the initial prompt
Hide

# Show the terminal
Show

# Demo 1: Quick Start Flow
Type "# 🎫 Get your ticket for the AI Express!"
Sleep 1s
Enter
Type "npm install -g conductor-cli"
Sleep 2s
Enter
Sleep 1s

Type "# 🚂 All aboard! Set up your choo choo train"
Sleep 1s
Enter
Type "conductor init --quick"
Sleep 3s
Enter
Sleep 2s

Type "# 🚂💨 Choo choo! Launch the AI development express"
Sleep 1s
Enter
Type "conductor launch"
Sleep 3s
Enter
Sleep 2s

# Demo 2: Rubber Duck Sessions
Type "# 🦆🚂 Start rubber ducking with your AI train crew!"
Sleep 1s
Enter
Type "conductor ask \"analyze my React component performance\""
Sleep 2s
Enter
Sleep 1s

Type "conductor ask @frontend \"optimize this user interface\""
Sleep 2s
Enter
Sleep 1s

Type "conductor ask @security \"review this authentication flow\""
Sleep 2s
Enter
Sleep 1s

# Demo 3: Dashboard
Type "# 📊 Live train monitoring station"
Sleep 1s
Enter
Type "conductor dashboard"
Sleep 2s
Enter
Sleep 3s

# Demo 4: Team Review
Type "# 🎭 Multi-agent review car"
Sleep 1s
Enter  
Type "conductor review --staged"
Sleep 2s
Enter
Sleep 2s

# Demo 5: Ship to Production
Type "# 🚂 Destination: Production!"
Sleep 1s
Enter
Type "conductor ship \"user-auth-feature\" --security-scan"
Sleep 3s
Enter
Sleep 2s

Type "# 🎉 All aboard for production! 🚂🦆"
Sleep 2s
Enter

Sleep 3s