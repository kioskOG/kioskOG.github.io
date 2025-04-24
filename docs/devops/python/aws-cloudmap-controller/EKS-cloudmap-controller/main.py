from controller import k8s_watcher, cloudmap

if __name__ == "__main__":
    cloudmap.start_sync_loop()
    k8s_watcher.start()