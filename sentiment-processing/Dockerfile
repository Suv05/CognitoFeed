FROM apache/beam_python3.11_sdk:2.66.0

# Ensure dependencies are installed globally
ENV RUN_PYTHON_SDK_IN_DEFAULT_ENVIRONMENT=1 \
    PIP_NO_CACHE_DIR=1

# Install required dependencies
RUN pip install --no-cache-dir \
    vaderSentiment==3.3.2 \
    emoji==2.14.1 \
    regex==2024.11.6 \
    torch==2.7.1 \
    transformers==4.53.3 
