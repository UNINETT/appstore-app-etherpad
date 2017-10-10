# Pushing this to QUAY without selling your soul

Quay is awesome.  So awesome that it wants full access to your GitHub account
if you want to automatically push a measily Docker image there.

If you're paranoid like me, you probably didn't go through with the process
and are now looking how to securely deploy a secure Docker container to the
cloud (lol).

1. Go stand in the project root, it's the directory the Dockerfile is in.

2. Log in to Quay

You may need to set a password in Quay.  If you've first logged in through
GitHub you don't have a password.  Quay has this fancy feature called
"Encrypted Password" because it's *dangerous*™ to use your own password on
the command-line, [but that only encrypts your actual password](https://security.blogoverflow.com/2011/11/why-passwords-should-be-hashed/).

So what should you do?  Go to your profile (in Quay click your username upper right,
click **Account Settings** and then click **Change password** about halfway
through the page).  Generate some random password and write it on a post-it,
and use that password on the command line when it asks for it.

		docker login quay.io

3. Copy these commands, go to your terminal, close your eyes and press ⌘V:

		docker build . -t quay.io/uninett/etherpad`
		docker push quay.io/uninett/etherpad

Open your eyes, and you've now probably successfully published a docker image to Quay.

You can now deploy it on UNINETT infrastructure using [HELM](helm/README.md).
