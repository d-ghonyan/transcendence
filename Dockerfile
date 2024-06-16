FROM elasticsearch:7.9.1

# Add your custom plugins or libraries here
# Ensure they do not introduce conflicting JAR versions
# For example:
# COPY plugins /usr/share/elasticsearch/plugins/

RUN elasticsearch-plugin install analysis-icu
RUN elasticsearch-plugin install analysis-kuromoji

# Ensure proper permissions
RUN chmod -R 777 /usr/share/elasticsearch/plugins/
