# Configuration file for the Sphinx documentation builder.

import sphinx_rtd_theme

import recommonmark
from recommonmark.transform import AutoStructify

# ----- Project information --------------------------------------------------------------------------------------------

project = 'Stim.js'
copyright = '2021, Roy de Jong'
author = 'Roy de Jong'

# ----- General configuration ------------------------------------------------------------------------------------------

extensions = ['recommonmark', 'sphinx_rtd_theme']
templates_path = ['_templates']
exclude_patterns = []

# ----- Options for HTML output ----------------------------------------------------------------------------------------

html_theme = 'sphinx_rtd_theme'
html_static_path = ['_static']

# ----- AutoStructify for table of contents ----------------------------------------------------------------------------

def setup(app):
    app.add_config_value('recommonmark_config', {
        'auto_toc_tree_section': 'Contents'
    }, True)
    app.add_transform(AutoStructify)