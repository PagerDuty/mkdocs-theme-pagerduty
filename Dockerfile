# https://circleci.com/docs/2.0/circleci-images/#python
# We may as well use the same image we use for actually deploying our sites.
FROM circleci/python:3.9.2

# Dependencies
RUN sudo pip install mkdocs
RUN sudo pip install pymdown-extensions
RUN sudo pip install pygments

# Set our working directory and user
RUN sudo useradd -m --uid 1000 mkdocs
USER mkdocs
WORKDIR /docs

# Expose MkDocs server
EXPOSE 8000

# Start the local MkDocs server.
ENTRYPOINT ["mkdocs"]
CMD ["serve", "--dev-addr=0.0.0.0:8000"]
