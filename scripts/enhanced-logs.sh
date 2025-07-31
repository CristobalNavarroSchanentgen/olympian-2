#!/bin/bash

# Enhanced Logging Script for Olympian AI
# Provides unified view of server logs, browser logs, and system metrics

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="http://localhost:3001"
LOG_OUTPUT_DIR="./logs"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

print_banner() {
    echo -e "${CYAN}"
    echo "??????????????????????????????????????????????????????????????????"
    echo "?                    ? OLYMPIAN AI LOGS ?                     ?"
    echo "?          Unified Browser + Server + Infrastructure Logs       ?"
    echo "??????????????????????????????????????????????????????????????????"
    echo -e "${NC}"
}

check_services() {
    echo -e "${BLUE}? Checking service status...${NC}"
    
    # Check if Docker services are running
    if ! docker-compose ps | grep -q "Up"; then
        echo -e "${RED}? Docker services not running. Start with: make docker-up${NC}"
        exit 1
    fi
    
    # Check if backend is accessible
    if ! curl -s "$BACKEND_URL/api/health" > /dev/null 2>&1; then
        echo -e "${YELLOW}??  Backend API not accessible at $BACKEND_URL${NC}"
    else
        echo -e "${GREEN}? Backend API accessible${NC}"
    fi
    
    echo ""
}

show_log_stats() {
    echo -e "${PURPLE}? Log Statistics:${NC}"
    
    # Get browser log stats from API
    if curl -s "$BACKEND_URL/api/logs/stats" > /dev/null 2>&1; then
        STATS=$(curl -s "$BACKEND_URL/api/logs/stats")
        echo "   Browser Logs: $(echo "$STATS" | grep -o '"totalLogs":[0-9]*' | cut -d':' -f2)"
        echo "   Error Count: $(echo "$STATS" | grep -o '"errorCount":[0-9]*' | cut -d':' -f2)"
        echo "   Active Sessions: $(echo "$STATS" | grep -o '"activeSessions":[0-9]*' | cut -d':' -f2)"
    else
        echo "   Browser Logs: API not available"
    fi
    
    # Get Docker container stats
    echo "   Container Status:"
    docker-compose ps --format "table {{.Name}}\t{{.Status}}" | tail -n +2 | while read line; do
        echo "     $line"
    done
    
    echo ""
}

stream_all_logs() {
    echo -e "${GREEN}? Streaming all logs (Ctrl+C to stop)...${NC}"
    echo ""
    
    # Start Docker logs with immediate output (macOS compatible)
    {
        docker-compose logs --no-color -f | while IFS= read -r line; do
            printf "\033[0;34m[DOCKER]\033[0m %s\n" "$line"
        done
    } &
    DOCKER_PID=$!
    
    # Start browser logs with immediate output  
    {
        while true; do
            if curl -s "$BACKEND_URL/api/logs?format=json" > /dev/null 2>&1; then
                LOGS=$(curl -s "$BACKEND_URL/api/logs?format=json" 2>/dev/null | jq -r '.logs[]? | "[" + .timestamp + "] [" + .level + "] [" + (.source // "browser") + "] " + .message' 2>/dev/null)
                if [ -n "$LOGS" ]; then
                    echo "$LOGS" | while IFS= read -r line; do
                        if [[ $line == *"[error]"* ]]; then
                            printf "\033[0;31m[BROWSER]\033[0m %s\n" "$line"
                        elif [[ $line == *"[warn]"* ]]; then
                            printf "\033[1;33m[BROWSER]\033[0m %s\n" "$line"
                        else
                            printf "\033[0;36m[BROWSER]\033[0m %s\n" "$line"
                        fi
                    done
                fi
            fi
            sleep 3
        done
    } &
    BROWSER_PID=$!
    
    # Handle cleanup on interrupt
    cleanup() {
        echo ""
        echo -e "${YELLOW}? Stopping log streams...${NC}"
        kill $DOCKER_PID $BROWSER_PID 2>/dev/null || true
        exit 0
    }
    
    trap cleanup INT TERM
    
    # Wait for interrupt
    wait
}

export_logs() {
    echo -e "${GREEN}? Exporting logs to $LOG_OUTPUT_DIR...${NC}"
    
    mkdir -p "$LOG_OUTPUT_DIR"
    
    # Export Docker logs
    echo "Exporting Docker container logs..."
    docker-compose logs --no-color > "$LOG_OUTPUT_DIR/docker-logs-$TIMESTAMP.log"
    
    # Export browser logs
    if curl -s "$BACKEND_URL/api/logs?format=csv" -o "$LOG_OUTPUT_DIR/browser-logs-$TIMESTAMP.csv" > /dev/null 2>&1; then
        echo "Browser logs exported as CSV"
    fi
    
    if curl -s "$BACKEND_URL/api/logs?format=json" -o "$LOG_OUTPUT_DIR/browser-logs-$TIMESTAMP.json" > /dev/null 2>&1; then
        echo "Browser logs exported as JSON"
    fi
    
    # Create summary report
    cat > "$LOG_OUTPUT_DIR/log-summary-$TIMESTAMP.md" << EOF
# Olympian AI Log Summary
Generated: $(date)

## System Status
- Docker Services: $(docker-compose ps --format "{{.Name}}: {{.Status}}" | tr '\n' ', ')
- Backend API: $(curl -s "$BACKEND_URL/api/health" > /dev/null 2>&1 && echo "? Available" || echo "? Not Available")

## Log Files Generated
- Docker Logs: docker-logs-$TIMESTAMP.log
- Browser Logs (CSV): browser-logs-$TIMESTAMP.csv  
- Browser Logs (JSON): browser-logs-$TIMESTAMP.json

## Browser Log Statistics
$(curl -s "$BACKEND_URL/api/logs/stats" 2>/dev/null | jq -r 'to_entries | map("- \(.key): \(.value)") | join("\n")' || echo "API not available")
EOF
    
    echo -e "${GREEN}? Logs exported to $LOG_OUTPUT_DIR${NC}"
    echo "Summary report: $LOG_OUTPUT_DIR/log-summary-$TIMESTAMP.md"
}

show_help() {
    echo "Enhanced Logging Script for Olympian AI"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  stream     Stream all logs in real-time (default)"
    echo "  export     Export logs to files"
    echo "  stats      Show log statistics only"
    echo "  browser    Show browser logs only"
    echo "  docker     Show Docker logs only"
    echo "  help       Show this help message"
    echo ""
}

# Main script logic
case "${1:-stream}" in
    "stream")
        print_banner
        check_services
        show_log_stats
        stream_all_logs
        ;;
    "export")
        print_banner
        check_services
        export_logs
        ;;
    "stats")
        print_banner
        check_services
        show_log_stats
        ;;
    "browser")
        print_banner
        check_services
        echo -e "${CYAN}? Browser logs only:${NC}"
        curl -s "$BACKEND_URL/api/logs?format=json" | jq -r '.logs[] | "[" + .timestamp + "] [" + .level + "] " + .message'
        ;;
    "docker")
        print_banner
        check_services
        echo -e "${BLUE}? Docker logs only:${NC}"
        docker-compose logs --no-color
        ;;
    "help"|"--help")
        show_help
        ;;
    *)
        echo "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
