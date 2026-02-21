import traceback
try:
    import main
except Exception:
    with open('error.log', 'w') as f:
        traceback.print_exc(file=f)
