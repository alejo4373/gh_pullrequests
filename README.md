# GitHub Repos Downloader

JavaScript program to download all forks for a specified github repo or all repos given in a file. 

## Setup

1. Clone this repo and `cd` into it.

2. Install dependencies
    ```
    npm i
    ``` 

3. Invoke script.

There are two CLI options for cloning repos
* `--forks-from`. To download all forks from a specified repo.

  ```
  node index.js --forks-from=joinpursuit/Pursuit-Core-Web-Express-Group-Project forks/express_group_project
  ```

* `--repos-file`. To download repos that are specified in a file. Repos must be in a new-line separated list like in a `repos.txt` with the following content:

  ```
  user1/repoA
  user2/repoB
  alejo4373/GameOn
  ```

  ```
  node index.js --repos-file=./repos.txt ./clonedRepos   
  ```


