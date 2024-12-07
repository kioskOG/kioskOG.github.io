<script>
  // Check for saved preference in localStorage
  const isDarkMode = localStorage.getItem('dark-mode') === 'true';

  // Apply dark mode if saved preference exists
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  }

  // Dark mode toggle functionality
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-mode');
      // Save preference in localStorage
      localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
    });
  }
</script>

