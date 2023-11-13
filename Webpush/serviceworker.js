addEventListener('push', (event) => {
    const data = event.data.json();

    self.registration.showNotification(data.title, {
        body: data.body,
        icon: 'https://cableriedaumesnilblog.com/wp-content/uploads/2022/10/Twitter-Logo-Png-Transparent-Background.jpg',
        vibrate: [100, 50, 100],
    });
});