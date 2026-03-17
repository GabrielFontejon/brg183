# System Diagrams for Lupon Tagapamayapa Case Management System

Here are the requested diagrams based on the system's current functionality, focusing on your specific rules:
- **Arrows/Data Flows = Nouns** (e.g., "Generated PDF", "Case Details")
- **Processes/Entities = Verbs/Actions** (for processes) or Nouns (for database tables/external entities).

## 1. System Architecture / Environment Diagram (Context)

This diagram mirrors the structure of your example, illustrating the physical/logical components like servers, firewalls, and the local tech stack (Laravel, React, MySQL), rather than just the flow of data.

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': { 'darkMode': true, 'background': '#000000', 'primaryColor': '#1c1c1c', 'primaryTextColor': '#ffffff', 'lineColor': '#888888' }}}%%
flowchart TD
    classDef serverBox fill:#f0f8ff,stroke:#0055a4,stroke-width:2px,rx:15,ry:15
    classDef vmBox fill:#fff5e6,stroke:#d95d00,stroke-width:2px,rx:15,ry:15

    remote_staff(["Remote Staff / Secretary"]) -->|"Encrypted Web Request"| internet("fa:fa-cloud Internet")
    internet -->|"Secure Tunnel"| cloudflare("Cloudflare (Reverse Proxy)")
    cloudflare -->|"Filtered Web Traffic"| isp("PLDT (ISP)")

    local_staff(["fa:fa-user-tie Data Encoder"])
    admin(["fa:fa-user-cog Barangay Admin"])

    subgraph OnPremise [Barangay 183 Data Encoder PC]
        direction TB
        firewall("Windows Defender / OS Firewall")
        server("fa:fa-desktop Local Host Machine (Windows 11/10)")
        env_manager("Laravel Herd / XAMPP (Local Web Host)")
        
        firewall <-->|"Security Protocol"| server
        server <-->|"Host Resources"| env_manager
    end

    isp -->|"Incoming / Outgoing Data"| firewall
    
    local_staff -->|"Direct PC Input"| server
    admin -->|"System Configuration"| server

    subgraph VM_Web [Application Web Server]
        direction TB
        os_web("fa:fa-windows Local PC") --- laravel("Laravel (Backend / API)") --- react("React JS (Frontend UI)")
    end

    subgraph VM_DB [Database Service]
        direction TB
        os_db("fa:fa-windows Local PC") --- mysql("fa:fa-database MySQL Server")
    end

    env_manager -->|"HTTP Requests"| os_web
    env_manager -->|"SQL Queries"| os_db

    class OnPremise serverBox
    class VM_DB,VM_Web vmBox
```

## 2. Data Flow Diagram (DFD) Level 0

This breaks down the "Process Lupon System" into its core major processes. Notice that the authentication process acts as a gateway; it must generate a "Session Token" which is then required as input data for all subsequent processes to function. All processes are verbs and data flows are nouns.

```mermaid
flowchart TD
    access_system(("Access\nSystem"))
    
    authenticate_user(("1. Authenticate\nIdentity"))
    manage_cases(("2. Manage\nCase\nRecords"))
    generate_docs(("3. Generate\nCase\nDocuments"))
    
    %% Flows (Bidirectional strictly to avoid overlapping lines in drawing)
    access_system <-->|"Login Credentials / Verified Identity"| authenticate_user
    access_system <-->|"Case Details / Case Notification"| manage_cases
    access_system <-->|"Template Selection / Generated PDF"| generate_docs
    
    %% Outer edge flow
    manage_cases -->|"Case Reference Data"| generate_docs
```

## 3. Data Flow Diagram (DFD) Level 1 (Full System Detail)

This expands on *every* process from Level 0, providing a much higher level of detail for the entire system, while maintaining the rule that processes are verbs and data flows are nouns.

```mermaid
flowchart TD
    access_system(("Access System Interace"))
    
    ds_users[("D1: Users Table")]
    ds_cases[("D2: Cases Table")]
    ds_documents[("D3: Documents Table")]
    ds_audit[("D4: Audit Log Table")]
    ds_layouts[("D5: Form Layouts Table")]

    subgraph Auth [Process 1: Authenticate Identity]
        validate_creds(("1.1 Validate Credentials"))
        manage_sessions(("1.2 Manage Session"))
    end

    subgraph Cases [Process 2: Manage Case Records]
        create_case(("2.1 Create Case Record"))
        update_case(("2.2 Update Case Status"))
        search_cases(("2.3 Search/Filter Cases"))
    end

    subgraph Docs [Process 3: Generate Case Documents]
        fetch_case_data(("3.1 Fetch Case Context"))
        compile_template(("3.2 Compile Document Template"))
        render_pdf(("3.3 Render PDF Format"))
        save_doc_record(("3.4 Save Document Metadata"))
    end

    subgraph Audit [Process 4: Track System Audit]
        record_action(("4.1 Record Actions & Logins"))
    end

    %% Auth Flows
    access_system -->|"Login Credentials"| validate_creds
    validate_creds <-->|"Query / Status"| ds_users
    validate_creds -->|"Verification Result"| manage_sessions
    manage_sessions -->|"Session Token"| access_system
    manage_sessions -->|"Login Event"| record_action

    %% Cases Flows
    access_system -->|"New Details"| create_case
    access_system -->|"Modifications"| update_case
    access_system -->|"Search Criteria"| search_cases
    
    create_case -->|"Case Entry"| ds_cases
    update_case -->|"Updated Data"| ds_cases
    search_cases <-->|"Query / Results"| ds_cases
    search_cases -->|"Matched Case Data"| access_system
    
    create_case -->|"Creation Event"| record_action
    update_case -->|"Update Event"| record_action

    %% Docs Flows
    access_system -->|"Template Selection & Case ID"| fetch_case_data
    access_system -->|"Manual Form Inputs"| compile_template
    
    fetch_case_data <-->|"Case Query / Specific Details"| ds_cases
    fetch_case_data -->|"Requested Context"| compile_template
    compile_template <-->|"Template Query / Coordinates"| ds_layouts
    
    compile_template -->|"Populated HTML View"| render_pdf
    render_pdf -->|"Generated PDF File"| access_system
    render_pdf -->|"Document Details"| save_doc_record
    
    save_doc_record -->|"New Document Entry"| ds_documents
    save_doc_record -->|"Generation Event"| record_action

    %% Audit Flows
    record_action -->|"System Operation Log"| ds_audit
```

## 4. Procedural Diagram / Flowchart (Full System Lifecycle)

This diagram shows the end-to-end, high-level sequential logic of a user interacting with the Lupon Case Management System, keeping processes as verbs and the data/control flows as nouns (or conditions).

```mermaid
flowchart TD
    %% Define Shapes
    begin([BEGIN])
    input_creds[/INPUT CREDENTAILS/]
    check_creds{VALID\nCREDENTIALS}
    dashboard[DASHBOARD]
    
    %% Main Menu Decisions
    menu_cases{CASE\nMANAGEMENT}
    menu_docs{DOCUMENT}
    menu_analytics{ANALYTICS}
    menu_reports{REPORTS}
    menu_users{USERS}
    menu_settings{SETTINGS}
    
    %% Start Flow
    begin --> input_creds
    input_creds --> check_creds
    
    %% Auth Loop
    check_creds -->|NO| input_creds
    
    %% Enter Dashboard
    check_creds -->|YES| dashboard
    
    %% Menu Hub Node (Representing the A Circle)
    hub_a((A))
    hub_a --> dashboard
    
    %% Dashboard -> Menu Chain
    dashboard --> menu_cases
    menu_cases -->|NO| menu_docs
    menu_docs -->|NO| menu_analytics
    menu_analytics -->|NO| menu_reports
    menu_reports -->|NO| menu_users
    menu_users -->|NO| menu_settings
    menu_settings -->|NO| end_node([END / LOGOUT])
    
    %% Branch: Case Management
    hub_b((B))
    hub_b --> menu_cases
    
    case_page[CASE MANAGEMENTPAGE]
    input_case[/INPUT NEW CASE/]
    save_case[SAVE]
    db_case[(DATABASE:\nNEW CASE\nRECORDED)]
    print_doc_case{PRINT\nDOCUMENT}
    print_new_cases[/PRINT: NEW CASES/]
    
    menu_cases -->|YES| case_page
    case_page --> input_case
    input_case --> save_case
    save_case --> db_case
    db_case --> print_doc_case
    
    print_doc_case -->|NO| hub_b
    print_doc_case -->|YES| print_new_cases
    print_new_cases --> hub_a
    
    %% Branch: Document
    hub_c((C))
    hub_c --> menu_docs
    
    doc_page[DOCUMENT PAGE]
    gen_doc[/GENERATE DOCUMENT/]
    print_doc_docs{PRINT\nDOCUMENT}
    print_gen_docs[/PRINT:\nGENERATED\nDOCUMENTS/]
    
    menu_docs -->|YES| doc_page
    doc_page --> gen_doc
    gen_doc --> print_doc_docs
    
    print_doc_docs -->|NO| hub_c
    print_doc_docs -->|YES| print_gen_docs
    print_gen_docs --> hub_c
    
    %% Branch: Analytics
    hub_d((D))
    hub_d --> menu_analytics
    
    analytics_page[ANALYTICS PAGE]
    select_date[/SELECT: DATE RANGE/]
    
    menu_analytics -->|YES| analytics_page
    analytics_page --> select_date
    select_date --> hub_d
    
    %% Branch: Reports
    hub_e((E))
    hub_e --> menu_reports
    
    reports_page[REPORTS PAGE]
    gen_reports[/GENERATE: REPORTS/]
    download_pdf{DOWNLOAD\nPDF}
    download_docs[/DOWNLOAD: PDF\nDOCUMENTS/]
    
    menu_reports -->|YES| reports_page
    reports_page --> gen_reports
    gen_reports --> download_pdf
    
    download_pdf -->|NO| hub_e
    download_pdf -->|YES| download_docs
    download_docs --> hub_e
    
    %% Branch: Users
    hub_f((F))
    hub_f --> menu_users
    
    users_page[USER MANAGEMENT PAGE]
    add_user[/ADD USER/]
    input_user[/INPUT: USER\nDETAILS/]
    save_user[SAVE]
    db_user[(DATABASE:\nUPDATE\nNEW USER)]
    
    menu_users -->|YES| users_page
    users_page --> add_user
    add_user --> input_user
    input_user --> save_user
    save_user --> db_user
    db_user --> hub_f
    
    %% Branch: Settings
    hub_g((G))
    hub_g --> menu_settings
    
    settings_page[SETTINGS PAGE]
    edit_profile{EDIT PROFILE\nINFORMATION}
    edit_password{EDIT\nPASSWORD}
    delete_account{DELETE\nACCOUNT}
    
    add_profile[/ADD PROFILE:\nINFORMATION/]
    save_profile[SAVE]
    db_profile[(DATABASE:\nUPDATE PROFILE\nINFORMATION)]
    
    edit_pass_input[/EDIT:\nPASSWORD/]
    save_pass[SAVE]
    db_pass[(DATABASE:\nUPDATE\nPASSWORD)]
    
    menu_settings -->|YES| settings_page
    settings_page --> edit_profile
    
    %% Settings -> Edit Profile Sub-branch
    edit_profile -->|YES| add_profile
    add_profile --> save_profile
    save_profile --> db_profile
    db_profile --> hub_g
    
    %% Settings -> Edit Password Sub-branch
    edit_profile -->|NO| edit_password
    edit_password -->|YES| edit_pass_input
    edit_pass_input --> save_pass
    save_pass --> db_pass
    db_pass --> hub_g
    
    %% Settings -> Delete Account Sub-branch
    edit_password -->|NO| delete_account
    delete_account -->|YES| hub_g
    delete_account -->|NO| hub_g
```
